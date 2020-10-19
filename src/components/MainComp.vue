<template>
	<v-sheet class="grey lighten-4 ma-0 hoi pt-3">
		<v-card width="400" class="mx-auto">
			<v-img
					src="../assets/izones.png"
					height="200px"
				></v-img>
			<v-card-title class="bazz justify-center text-h4">
				<div class="bazz" style="color:#EBA0AF">IZ*GYM</div>
			</v-card-title>
			<div class="entire-wrap" v-if="loadingDone">
				<div class="ml-5 mb-3">오늘은 {{ getDayName() }} {{ getTodayDate() }}</div>
				<v-card elevation="2" class="www pa-2 mx-auto mb-5">
					<div>
						<div>{{ record.success }}일째 목표 달성 </div>
						<div>오늘의 달성률은 {{ percent }}%</div>
					</div>
					<v-row class="text-right mr-3" align="center" justify="end">
                        <v-icon color="#EBA0AF" elevation="3" large dark right @click="onSettings()">mdi-cog-outline</v-icon>
					</v-row>
				</v-card>

				<v-card elevation="2" class="ww pa-2 mx-auto">
					<p>{{ getDayName() }} 운동 목록</p>
					<div v-for="todo in todayTasks" v-bind:key="todo.id">
						<v-btn class="thebtn mb-3" color="pink lighten-5" v-on:click="onList(todo.id); onShow()">
							<div>{{ todo.name }} ~ {{ todo.total }}번 하기</div>
							<div class="small-text">현재 {{ todo.current }}번 성공</div>
						</v-btn>
					</div>
				</v-card>
				
				<template>
					<div class="text-center">
						<v-dialog
							v-model="dialog"
							width="400"
						>
							<v-card>
								<v-card-title class="pink lighten-2 mb-5"><span style="color:white">총 {{currentData.total}}회 하기</span></v-card-title>
								<v-card-text>
									<v-row>
										<v-col class="pr-4">
											<v-slider
												v-model="theCurrent"
												class="align-center"
												:max="currentData.total"
												:min="0"
                                                color="pink"
                                                track-color="pink lighten-4"                                                
                                                thumb-color="pink lighten-1"
												thumb-label="always"
												@change="onUpdateCurrent(currentData.id, theCurrent, currentData.current)"
											>
											</v-slider>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-dialog>
					</div>
				</template>

			
				<div class="black" v-if="visibles" v-on:click="onClose()"></div>
				<!-- <div class="black-inside" v-if="visibles">
						<div v-if="currentData" class="black-wrap">
							<h4>{{ currentData.name }}</h4>
							<div class="space"></div>
							<div class="crt-wrap">
								<div class="crt-btn" v-for="i in parseInt(currentData.total)" v-bind:key="i" v-bind:class="i <= currentData.current ? 'crt-done' : null" v-on:click="onUpdateCurrent(currentData.id, i, currentData.current)"> {{ i }}</div>
							</div>
						</div>
				</div> -->
				<div class="ani-wrap" v-if="aniWrap" v-on:click="onAniClose()">
					<div class="conver-wrap"></div>
				</div>

			</div>
			<div class="loading-wrap" v-else>Loading</div>

		</v-card>


	</v-sheet>
</template>


<script src="./MainComp.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@font-face {
    font-family: 'Bazzi';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/Bazzi.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
    
.bazz{font-family: 'Bazzi';}
.hoi { min-height: 100vh; padding:0;}
.entire-wrap{
    // width:100%;
    width:400px;
    margin-left:calc((100% - 400px) / 2);
    // height:calc(100vh - 4vh - 40px);
		min-height: calc(100vh - 350px);
    position:relative;
    font-family: 'Bazzi';
		border-radius:10px;

    // overflow-y: scroll;
    // &::-webkit-scrollbar {
    //     width: 5px;
    // }
    
    // &::-webkit-scrollbar-track {
    // box-shadow: inset 0 0 6px pink;
    // }
    
    // &::-webkit-scrollbar-thumb {
    // background-color: pink;
    // outline: 1px solid slategrey;
    // }

		.www { width:90%; 
			display:grid;
			grid-template-columns: 1fr 1fr;
		}
		.ww {width:90%;}
		.thebtn { width:100%;
			.small-text {
				width:100%;
				font-size:13px;
				text-align: right;
			}
		}

    .left-deco {
        height:100%;
        display:grid;
        align-items:center;
        font-size:25px;
    }
    .right-deco {
        .small-text {
            font-size:15px;
            opacity:0.8;
        }
    }

    .inst {
        display:grid;
        grid-template-columns: 1fr 1fr;
    }
    

    .bottom-img {
        background:url('../assets/izones.png');
        background-size: 100% 100%;
        position:sticky;
        height:200px;
        width:100%;
        left:0;
        bottom:0;
        z-index:-1;
    }


}


.black {
	position:fixed;
	width: 400px; 
	height:calc(100vh - 4vh);
	position:fixed;
	left:calc((100% - 400px) / 2);
	top:2vh;
	z-index:10;
	background:rgba(0,0,0,0.7);
}
.black-inside {
    position:fixed;
    width: 400px; 
    height:350px;
    // height:calc(100vh - 4vh - 60px);
    position:fixed;
    left:calc((100% - 400px) / 2);
    top:100px;
    z-index:11;
    color:white;
    overflow-y: scroll;
    padding:30px 0;
    .black-wrap{
        width:90%; margin-left:5%;
    }
    &::-webkit-scrollbar {
    width: 5px;
    }
    
    &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    
    &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    }

}

.crt-wrap {
    width:100%;
    display:grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap:5px;
    .crt-btn, .crt-done {
        background: rgba(0,0,0, 0.6);
        color:white;
        padding:15px 0;
        font-size:13px;
        cursor:pointer;
    }
    .crt-done {
        background:black;
        color: white;
    }

}

.ani-wrap {
    width: 400px; 
    height:calc(100vh - 4vh);
    position:fixed;
    left:calc((100% - 400px) / 2);
    top:10px;
    background:white;
    background-size: 100% 100%;
    background-position: center;
    transition: 500ms;
    opacity:0;
    @media only screen and (max-width: 400px) {
        height: 100vh;
        top:0;
        left:0;
        width:100%;
    }
    .conver-wrap {
        position: absolute;
        left:20px; bottom:20px;
        width:calc(100% - 60px);
        height:60px;
        border:2px solid pink;
        padding:10px;
        font-size: 20px;
        text-align:left;
        background: rgba(255,255,255, 0.7);
        letter-spacing: 2px;
        color:black;
        border-radius:10px;
        @media only screen and (max-width: 400px) {
            width:calc(100vw - 60px);
            left: 15px;
        }
    }
}
.play {opacity:1;}

.space { height: 20px; }
.date-para {
    text-align: left;
    font-size: 15px;
    width: calc(100% - 40px);
    margin-left:20px;
    margin-top:5px;
    &:last-child { margin-bottom: 50px; }
}

.loading-wrap {
    display:grid;
    align-items: center;
    justify-content:center;
    font-size:12px;
    width:100%; height:100vh;
}


   .minju{
        background:url('../assets/images/minju1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .wonyoung{
        background:url('../assets/images/wonyoung1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .nako{
        background:url('../assets/images/nako1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .eunbi{
        background:url('../assets/images/eunbi1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yena{
        background:url('../assets/images/yena1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yuri{
        background:url('../assets/images/yuri1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .sakura{
        background:url('../assets/images/sakura1.png');
        background-size:cover;
        background-position: right no-repeat;
    }
    .hitomi{
        background:url('../assets/images/hitomi1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yujin{
        background:url('../assets/images/yujin1.png');
        background-size:cover;
        background-position: center no-repeat;
    }    
    .hyewon{
        background:url('../assets/images/hyewon1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaewon{
        background:url('../assets/images/chaewon1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaeyeon{
        background:url('../assets/images/chaeyeon1.png');
        background-size:cover;
        background-position: center no-repeat;
    }


    //2
    .minju2{
        background:url('../assets/images/minju2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .wonyoung2{
        background:url('../assets/images/wonyoung2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .nako2{
        background:url('../assets/images/nako2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .eunbi2{
        background:url('../assets/images/eunbi2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yena2{
        background:url('../assets/images/yena2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yuri2{
        background:url('../assets/images/yuri2.png');
        background-size:cover;
        background-position: left no-repeat;
    }
    .sakura2{
        background:url('../assets/images/sakura2.png');
        background-size:cover;
        background-position: right no-repeat;
    }
    .hitomi2{
        background:url('../assets/images/hitomi2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yujin2{
        background:url('../assets/images/yujin2.png');
        background-size:cover;
        background-position: center no-repeat;
    }    
    .hyewon2{
        background:url('../assets/images/hyewon2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaewon2{
        background:url('../assets/images/chaewon2.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaeyeon2{
        background:url('../assets/images/chaeyeon2.png');
        background-size:cover;
        background-position: center no-repeat;
    }


    //3
    .minju3{
        background:url('../assets/images/minju3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .wonyoung3{
        background:url('../assets/images/wonyoung3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .nako3{
        background:url('../assets/images/nako3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .eunbi3{
        background:url('../assets/images/eunbi3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yena3{
        background:url('../assets/images/yena3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yuri3{
        background:url('../assets/images/yuri3.png');
        background-size:cover;
        background-position: right no-repeat;
    }
    .sakura3{
        background:url('../assets/images/sakura3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .hitomi3{
        background:url('../assets/images/hitomi3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yujin3{
        background:url('../assets/images/yujin3.png');
        background-size:cover;
        background-position: center no-repeat;
    }    
    .hyewon3{
        background:url('../assets/images/hyewon3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaewon3{
        background:url('../assets/images/chaewon3.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaeyeon3{
        background:url('../assets/images/chaeyeon3.png');
        background-size:cover;
        background-position: left no-repeat;
    }    


    //4
    .minju4{
        background:url('../assets/images/minju1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .wonyoung4{
        background:url('../assets/images/wonyoung1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .nako4{
        background:url('../assets/images/nako1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .eunbi4{
        background:url('../assets/images/eunbi1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yena4{
        background:url('../assets/images/yena1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yuri4{
        background:url('../assets/images/yuri1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .sakura4{
        background:url('../assets/images/sakura1.png');
        background-size:cover;
        background-position: right no-repeat;
    }
    .hitomi4{
        background:url('../assets/images/hitomi1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .yujin4{
        background:url('../assets/images/yujin1.png');
        background-size:cover;
        background-position: center no-repeat;
    }    
    .hyewon4{
        background:url('../assets/images/hyewon1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaewon4{
        background:url('../assets/images/chaewon1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
    .chaeyeon4{
        background:url('../assets/images/chaeyeon1.png');
        background-size:cover;
        background-position: center no-repeat;
    }
</style>

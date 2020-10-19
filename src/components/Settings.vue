<template>
    <div v-if="noData">
        No Data. Please start from Main page
    </div>

    <div v-else>
        <div v-if="loadingDone">
            <div class="bottom-img"></div>
            <div class="day-wrap">
                <div v-bind:class="todayCode == 0 ? 'theday' : null" v-on:click="selectDay(0)">Sun</div>
                <div v-bind:class="todayCode == 1 ? 'theday' : null" v-on:click="selectDay(1)">Mon</div>
                <div v-bind:class="todayCode == 2 ? 'theday' : null" v-on:click="selectDay(2)">Tue</div>
                <div v-bind:class="todayCode == 3 ? 'theday' : null" v-on:click="selectDay(3)">Wed</div>
                <div v-bind:class="todayCode == 4 ? 'theday' : null" v-on:click="selectDay(4)">Thu</div>
                <div v-bind:class="todayCode == 5 ? 'theday' : null" v-on:click="selectDay(5)">Fri</div>
                <div v-bind:class="todayCode == 6 ? 'theday' : null" v-on:click="selectDay(6)">Sat</div>
            </div>

            <div>
                <div class="task-wrap" v-for="todo in getTodayTasks()" v-bind:key="todo.id">
                    <input class="task-input" type="text" v-on:input="debounceName($event, todo.id)" :value="todo.name" />
                    <input class="task-input" type="text" :id="todo.id" v-on:input="debounceInput($event, todo.id, todo.current)" @keypress="isNumber($event)" :value="todo.total" />
                    <button class="btn-submit" v-on:click="onDelete(todo.id)">삭제</button>
                </div>
            </div>
            <div class="add-wrap">
                <h5 style="margin-left:20px; font-weight:300;">새 작업 추가하기</h5>
                <div class="task-wrap">
                    <input class="task-input" id="add_name" type="text" value="" placeholder="작업 이름" />
                    <input class="task-input" id="add_total" @keypress="isNumber($event)" type="text" value="" placeholder="몇 회 할껀가요?" />
                    <button class="btn-submit" v-on:click="onAdd()">추가</button>
                </div>
            </div>
            <div class="add-wrap">
                <h5 style="margin-left:20px; font-weight:300;">닉네임 변경하기</h5>
                <div class="task-wrap">
                    <input class="task-input" id="change_name" type="text" :value="thename" placeholder="작업 이름" />
                    <button class="btn-submit" v-on:click="onChangeName()">변경</button>
                </div>
            </div>
        </div>

        <div v-else class="loading-wrap">
            Loading
        </div>
    </div>


</template>


<script src="./Settings.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@font-face {
    font-family: 'Bazzi';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/Bazzi.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.loading-wrap {
    display:grid;
    align-items: center;
    justify-content:center;
    font-size:12px;
    width:100%; height:100vh;
}

.day-wrap {
    display:grid;
    width:100%; height:40px;
    grid-template-columns: repeat(7, 1fr);
    font-family: 'Bazzi';
    align-items: center;
    cursor: pointer;
}

.task-input {
    font-family: 'Bazzi';
    font-size:15px;
    padding:10px;
}
.task-wrap {
    display:grid;
    grid-template-columns: 1fr 1fr 50px;
    width: calc(100% - 40px);
    margin-left:20px;
    margin-top:5px;
    @media only screen and (max-width: 400px) {
        width:100%;
        margin:0;
    }
}
.add-wrap{ margin-top: 20px; text-align: left; font-family: 'Bazzi';}
.btn-submit { font-family: 'Bazzi';}

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

.theday { color: magenta; }
</style>

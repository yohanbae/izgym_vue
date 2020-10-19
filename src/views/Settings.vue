<template>
	<v-sheet class="grey lighten-4 ma-0 hoi pt-3">
		<v-card width="400" class="mx-auto pb-3">

    <div v-if="noData">
        No Data. Please start from Main page
    </div>

    <div v-else>
        <div v-if="loadingDone">
				<v-img
					src="../assets/izones.png"
					height="200px"
				></v-img>
					<v-tabs grow show-arrows v-model="todayCode" class="mb-5">
						<v-tabs-slider color="blue lighten-2"></v-tabs-slider>
						<v-tab v-for="(item, i) in [`SUN`, `MON`, `TUE`, `WED`, 'THU', 'FRI', 'SAT']" :key="item" class="small-t pa-0" @click="selectDay(i)">
							{{ item }}
						</v-tab>
					</v-tabs>

					<v-sheet color="white" elevation="1" class="task-wrap mx-auto mb-3" v-for="todo in getTodayTasks()" v-bind:key="todo.id">
						<input class="task-input" type="text" v-on:input="debounceName($event, todo.id)" :value="todo.name" />
						<input class="task-input" type="text" :id="todo.id" v-on:input="debounceInput($event, todo.id, todo.current)" @keypress="isNumber($event)" :value="todo.total" />
						<v-btn class="btn-submit pa-0" v-on:click="onDelete(todo.id)">삭제</v-btn>
					</v-sheet>
						<v-divider class="mt-10"></v-divider>

            <v-sheet class="add-wrap mx-auto" color="white">
                <h5 style="font-weight:300; margin-left:10px">새 운동 추가하기</h5>
                <div class="task-wrap2">
                    <v-text-field label="운동 이름" class="task-input" id="add_name" type="text" value=""></v-text-field>
                    <v-text-field label="몇번해요?" class="task-input" id="add_total" @keypress="isNumber($event)" type="text" value=""></v-text-field>
                    <v-btn outlined class="ma-2" v-on:click="onAdd()">추가</v-btn>
                </div>
            </v-sheet>
						<v-divider class="mt-10"></v-divider>
            <v-sheet class="add-wrap mx-auto" color="white">
                <h5 style="margin-left:10px; font-weight:300;">닉네임 변경하기</h5>
                <div class="task-wrap3">
                    <input class="task-input" id="change_name" type="text" :value="thename" placeholder="작업 이름" />
                    <v-btn outlined class="ma-2" v-on:click="onChangeName()">변경</v-btn>
                </div>
            </v-sheet>
        </div>

        <div v-else class="loading-wrap">
            Loading
        </div>
    </div>

	</v-card>
	</v-sheet>
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
.hoi { min-height: 100vh; padding:0;}

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
    padding-left:10px;
}
.task-wrap, .task-wrap2 {
    display:grid;
    grid-template-columns: 1fr 100px 80px;
		width:90%;
    @media only screen and (max-width: 400px) {
        width:100%;
        margin:0;
    }
}
.task-wrap2 {
	width:100%;
	height:50px;
	align-items:center;
	grid-template-columns: 1fr 1fr 80px;
	padding:0; margin:0;
}
.task-wrap3 {
	display:grid;
	grid-template-columns: 1fr 1fr;
}

.add-wrap{ margin-top: 20px; text-align: left; font-family: 'Bazzi';
	padding:10px;
	width:100%;
}
.btn-submit { font-family: 'Bazzi'; font-size:12px; padding:0; width:80px; }

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
.small-t { font-size:10px;}
</style>



<script>

import generateId from "../hook/generateId"


// const debounce = (func) => {
//     let timeId = null;
//     return (...args) => {
//         if(timeId) {
//             clearTimeout(timeId);
//         }
//         timeId = setTimeout(() => {
//             func(...args);
//         }, 1000)
//     }
// }

export default {
  name: 'Settings',
  props: {
      mydata: String
  },
  data: function() {
      return {
        tasks : [], // EVery Days Task
        settings: [], // total days, how much percent will..,
        noData: false,
        todayTasks: [],
        todayCode: null,
        todayName: "",
        loadingDone: false,
        record: {},
        thename: ""
      }
  },
  created: function() {
    const db = localStorage.getItem('iz_ex_db')
    const re = localStorage.getItem('iz_re_db')
    if(db && re) {
        this.tasks = JSON.parse(db)
        this.record = JSON.parse(re)

        this.thename = this.record.name
        let day = new Date()
        this.todayCode = day.getDay()
        this.todayName = this.getDayName(this.todayCode)
        setTimeout(() => {
            // this.refreshTodayTasks(this.todayCode)
            this.loadingDone = true
        }, 1000)
    } else {
        this.noData = true
    }
    
  },
  methods: {
    getDayName: function(i) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        return days[i]
    },
    selectDay: function(i) {
				this.todayCode = i
				console.log("select", i)
    },
    getTodayTasks: function() {
        return this.tasks.find(val => val.daycode === this.todayCode).data  
    },
    saveDb: function() {
        localStorage.setItem("iz_ex_db", JSON.stringify(this.tasks))
    },
    saveRecord: function() {
        localStorage.setItem("iz_re_db", JSON.stringify(this.record))
    },
    onSaveTotal: function(id, value, current) {
        this.tasks.find(day => day.daycode === this.todayCode).data
            .find(val => val.id === id)
            .total = value
        
        if(current > value) {
            this.tasks.find(day => day.daycode === this.todayCode).data
            .find(val => val.id === id)
            .current = value
        }
        this.saveDb()
    },
    onSaveName: function(id, value) {
        this.tasks.find(day => day.daycode === this.todayCode).data
            .find(val => val.id === id)
            .name = value
        this.saveDb()
    },
    onDelete: function(id) {
        let newData = this.tasks.find(day => day.daycode === this.todayCode).data
            .filter(val => val.id !== id)
        this.tasks.find(day => day.daycode === this.todayCode).data = newData
        this.saveDb()
    },
    onAdd: function() {
        let name = document.querySelector('#add_name').value
        let total = document.querySelector('#add_total').value
        if(name !== "" && total !== "") {
            total = parseInt(total, 10)
            let newRow = {id: generateId(), name, current: 0, total }            
            this.tasks.find(day => day.daycode === this.todayCode).data
                .push(newRow)
            this.saveDb()

            document.querySelector('#add_name').value = ""
            document.querySelector('#add_total').value = ""
        }else{
            this.$vToastify.warning({title:'Missing', body:'Enter all information', theme:'light'});
        }
    },
    onChangeName: function() {
        let name = document.querySelector('#change_name').value
        if(name !== "") {
            this.record.name = name
            this.saveRecord()
            this.$vToastify.success({title:'성공', body:'이름이 변경됐습니다', theme:'light'});
        }else {
            this.$vToastify.warning({title:'Missing', body:'비어있습니다', theme:'light'});
        }
    },
    isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 46) {
            evt.preventDefault()
        } else {
            return true;
        }
    },
    debounceInput: function(evt, id, current) {
        let timeId = null;
        if(timeId) {
            clearTimeout(timeId)
        }
        timeId = setTimeout(() => {
            let input = evt.target.value
            if(input === "") {
                input = 1
                document.querySelector(`#${id}`).value = input
            } else {
                if(parseInt(input) <= 0) {
                    input = 1
                    document.querySelector(`#${id}`).value = input
                } else {
                    input = parseInt(input, 10)
                    document.querySelector(`#${id}`).value = input
                }
            }
            this.onSaveTotal(id, input, current)
        }, 1000)
    },
    debounceName: function(evt, id) {
        let timeId = null;
        if(timeId) {
            clearTimeout(timeId)
        }
        timeId = setTimeout(() => {
            let input = evt.target.value
            if(input === "") {
                this.$vToastify.warning({title:'Missing', body:'Task name missing', theme:'light'});
            } else {
                this.onSaveName(id, input)
            }
        }, 1000)
    },
    mywork: function(val) {
        console.log(val)
        return parseInt(val)
    }

  }
}
</script>

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
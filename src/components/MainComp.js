import generateId from "../hook/generateId"
import { pushup_text } from "./event";

export default {
  name: 'MainComp',
  props: {
      mydata: String
  },
  data: function() {
      return {
        tasks : [], // EVery Days Task
        settings: [], // total days, how much percent will..
        visibles: false,
        currentData: {}, // the data that chosen for update
        theCurrent: 0,
        loadingDone: false,
        todayCode : 0,
        todayTasks: [],
        percent : 0,
        record: {},
        aniWrap: false,
        playing: false,
        aniImage: "",
        dialog: false
      }
  },
  created: function() {
    console.log("Initializing", this.loadingDone)
    const db = localStorage.getItem("iz_ex_db");
    this.todayCode = (new Date()).getDay()

    if(db) {
        this.tasks = JSON.parse(db)

        this.record = JSON.parse(localStorage.getItem("iz_re_db"))

        const today = new Date();
        let recent = this.record.history[this.record.history.length - 1].datecode
        recent = new Date(recent)
        let recentDay = this.record.history[this.record.history.length - 1].daycode

        let diff = today.getTime() - recent.getTime();
        let diffDays = Math.floor(diff / (1000 * 3600 * 24)); 

        if(diffDays === 0) {
            // keep current day data
        } else {
            // if diffDays >= 2, then just -diffDays
            if(diffDays >= 2) {
                this.record.success = this.record.success - diffDays
                if(this.record.success < 0) this.record.success = 0
                this.$vToastify.warning({title:'슬퍼요', body:`${diffDays}일 접속하지 않았습니다`, theme:'light'});
            } else {
                // calculate success days // if over 90, +1, under 80 -1,
                this.getPercentByDay(recentDay)
                let percent = this.percent
                console.log('what about', percent)
                if(percent >= 90) {
                    this.record.success = this.record.success + 1
                    console.log('bigger than 90',  this.record.success)
                    this.$vToastify.success({title:'기뻐요', body:`어제 목표 달성에 성공했습니다. 성공일 +1`, theme:'light'});
                }else if(percent < 80) {
                    this.record.success = this.record.success - 1
                    if(this.record.success < 0) this.record.success = 0
                    console.log('less than 80',  this.record.success)
                    this.$vToastify.warning({title:'슬퍼요', body:`어제 목표 달성에 실패했습니다. 성공일 -1`, theme:'light'});
                }
            }

            this.tasks.find(val => val.daycode === this.todayCode).data
                .map(dat => dat.current = 0)
            this.percent = 0
            this.saveDb()

            this.record.history.push({datecode: new Date(), daycode: this.todayCode})
            this.saveRecord()
        }


    } else {
        // Initial Setup
        this.tasks = [
            {
                day: "Sunday",
                daycode: 0,
                data: [
                    {id: generateId(), name:'pullup', current:0, total: 50},
                    {id: generateId(), name:'pushup', current:0, total: 30},
                    {id: generateId(), name:'abs', current:0, total: 20}                    
                ]
            },
            {
                day: "Monday",
                daycode: 1,
                data: [
                    {id: generateId(), name:'Leg', current:0, total: 50},
                    {id: generateId(), name:'Shoulder', current:0, total: 30},
                    {id: generateId(), name:'Header', current:0, total: 20}                    
                ]
            },
            {
                day: "Tuesday",
                daycode: 2,
                data: [
                    {id: generateId(), name:'Hurry', current:0, total: 50},
                    {id: generateId(), name:'Eyes', current:0, total: 30},
                    {id: generateId(), name:'Brain', current:0, total: 20}                    
                ]
            },
            {
                day: "Wednesday",
                daycode: 3,
                data: [
                    {id: generateId(), name:'Dari', current:0, total: 50},
                    {id: generateId(), name:'Noon', current:0, total: 30},
                    {id: generateId(), name:'Pal', current:0, total: 20}                    
                ]
            },
            {
                day: "Thursday",
                daycode: 4,
                data: [
                    {id: generateId(), name:'Mori', current:0, total: 50},
                    {id: generateId(), name:'Ukkay', current:0, total: 30},
                    {id: generateId(), name:'Murub', current:0, total: 20}                    
                ]
            },
            {
                day: "Friday",
                daycode: 5,
                data: [
                    {id: generateId(), name:'Orange', current:0, total: 50},
                    {id: generateId(), name:'Yellow', current:0, total: 30},
                    {id: generateId(), name:'Blue', current:0, total: 20}                    
                ]
            },           
            {
                day: "Sunday",
                daycode: 6,
                data: [
                    {id: generateId(), name:'Hitomi', current:0, total: 50},
                    {id: generateId(), name:'Wonyoung', current:0, total: 30},
                    {id: generateId(), name:'Minju', current:0, total: 20}                    
                ]
            },           
        ]

        this.record = {
            success: 0,
            name: '주원오빠',
            history: [
                {datecode: new Date(), daycode: this.todayCode}
            ]
        }

        localStorage.setItem("iz_re_db", JSON.stringify(this.record))  
        localStorage.setItem("iz_ex_db", JSON.stringify(this.tasks))  
        console.log("set db")
    }



    setTimeout(() => {
        this.todayTasks = this.tasks.find(val => val.daycode === this.todayCode).data
        this.getPercent()

        this.loadingDone = true
    }, 1000)
  },
  methods: {
    onSettings: function() {
        this.$router.push('/settings')
    },
    onShow: function() {
        // this.visibles = true
        this.dialog = true
    },
    onClose: function() {
        console.log("click")
        this.visibles = false
        this.dialog = false
    },
    onList: function(id) {
        this.currentData = this.todayTasks.find(val => val.id === id)
        this.theCurrent = this.currentData.current
    },
    onUpdateCurrent: function(id, newCurrent, oldCurrent) {
        this.tasks.find(val => val.daycode === this.todayCode).data
            .find(the => the.id === id)
            .current = newCurrent
        this.getPercent()
        this.saveDb()
        this.onClose()

        if(newCurrent > oldCurrent) {
            this.onStartAni()
        }
    },
    onStartAni: function() {
        this.playing = true
        this.aniWrap = true

        let i = Math.floor(Math.random() * 36);
        const pushup_event = pushup_text(this.record.name);
        let txt = pushup_event[i].script;    
        this.aniImage = pushup_event[i].image;

        if(this.aniWrap){
            setTimeout(()=>{
                // Display Text
                document.getElementsByClassName('conver-wrap')[0].innerHTML = "";
                document.getElementsByClassName('ani-wrap')[0].classList.add(this.aniImage);
                document.getElementsByClassName('ani-wrap')[0].classList.add('play');

                let i = 0;
                // let txt = "반가워요. 사랑해요. 히히히. 열심히 화이팅" //this.script;
                let meme = setInterval(()=>{
                    if (i < txt.length) {
                        document.getElementsByClassName('conver-wrap')[0].innerHTML += txt.charAt(i);
                        i++;
                    }else{
                        this.playing = false;
                        clearInterval(meme)
                    }
                }, 50);
            }, 500);  
        }
    },
    onAniClose: function() {
        setTimeout(() => {
            if(!this.playing){
                document.getElementsByClassName('ani-wrap')[0].classList.remove('play');
                this.aniWrap = false
                document.getElementsByClassName('ani-wrap')[0].classList.remove(this.aniImage)
                console.log("text box closed")
            }
        }, 500)
    },
    saveDb: function() {
        localStorage.setItem("iz_ex_db", JSON.stringify(this.tasks))
    },
    saveRecord: function() {
        localStorage.setItem("iz_re_db", JSON.stringify(this.record))
    },
    getPercent: function() {
        let totalCurrent = 0;
        let totalTotal = 0;
        this.todayTasks.forEach(val => {
            totalCurrent += val.current
            totalTotal += val.total           
        })
        this.percent = Math.floor((totalCurrent / totalTotal) * 100)
    },
    getPercentByDay: function(theDay) {
        let totalCurrent = 0;
        let totalTotal = 0;
        this.tasks.find(day => day.daycode === theDay).data
            .forEach(val => {
                totalCurrent += val.current
                totalTotal += val.total           
            })
        this.percent = Math.floor((totalCurrent / totalTotal) * 100)
    },
    getDayName: function() {
        const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
        return dayNames[this.todayCode]
    },
    getTodayDate: function() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec']

        // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let mm = monthNames[today.getMonth()]
        let yyyy = today.getFullYear();

        today = mm + '.' + dd + ', ' + yyyy;
        return today
    }
  }
}
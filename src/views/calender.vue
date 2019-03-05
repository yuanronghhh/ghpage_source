<template>
  <div class="calendar">
    <div class="cal-top">
      <div class="cday">阳历&emsp; {{ cday.year }} 年 {{ cday.month }} 月 {{ cday.day }} 日</div>
      <div class="lunarday">农历&emsp; {{ cday.lunarMonthName }} {{ cday.lunarDayName }}</div>
      <div class="fest">节日&emsp; {{ cday.lunarFestival }} {{ cday.solarFestival }} {{ cday.term }}</div>
      <div class="lunar">
        <div class="Ganzhi">干之&emsp; {{ calendar.GanZhiYear }} {{ cday.GanZhiMonth }} {{ cday.GanZhiDay }} </div>
        <div class="zodiac">属相&emsp; {{ calendar.zodiac }} </div>
      </div>
      <div class="operate">
        <div class="set-day">设置日期: <input @input="setDay" class="op-btn" placeholder="格式: 20180102"></input></div>
        <span class="op-btn prev-month" @click="prevMonth()">上一个月</span>
        <span class="op-btn today-month" @click="todayMonth()">今天</span>
        <span class="op-btn next-month" @click="nextMonth()">下一个月</span>
      </div>
    </div>

    <div class="week-head">
      <div class="week-box" v-for="w in weeks">
        星期{{ w }}
      </div>
    </div>
    <div class="day-wrapper">
      <div class="day-box" v-for="ed in calendar.firstDay - 1">
        <div></div>
      </div>

      <div :data-id="dayInfo.day" :class="boldDay(dayInfo)" class="day-box" v-for="dayInfo in calendar.monthData" @click="setDayInfo(dayInfo)">
        <div>{{ dayInfo.day }}</div>
        <div :class="boldFest(dayInfo)">{{ dayMore(dayInfo) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '../libs/calendar'
import Logger from '../libs/logger'
import TimeConverter from '../libs/timeConverter'

export default {
  data () {
    return {
      weeks: ["一", "二", "三", "四", "五", "六", "日"],
      calendar: {
        firstDay: 0,
        monthDays: 0,
        GanZhiYear: 0,
        monthData: [],
        zodiac: ""
      },
      cday: {},
      today: {}
    }
  },
  methods: {
    parseDateInfo (input) {
      let year = parseInt(input.substr(0, 4))
      let month = parseInt(input.substr(4, 2))
      let day = parseInt(input.substr(6, 2))

      if (isNaN(year) || isNaN(month) || isNaN(day) || day <= 0) {
        return null
      }

      return {
        year: year,
        month: month,
        day: day
      }
    },
    setDay(evt) {
      let val = evt.target.value
      let day = this.parseDateInfo(val)

      if(day === null) {
        return
      }

      Logger.debug("setDay", day)

      let data = Calendar.getCalender(day.year, day.month)

      if (data.hasOwnProperty('error')) {
        Logger.debug("error", data.error, data.msg)
        return
      }

      this.setMonth(data)
      this.cday = data.monthData[day.day - 1]
    },
    setMonth(data) {
      if (data.hasOwnProperty("error") || data.monthData.length === 0) {
        Logger.debug(data.msg)
        return
      }

      this.calendar.monthDays = data.monthDays
      this.calendar.monthData = data.monthData
      this.calendar.GanZhiYear = data.monthData[0].GanZhiYear
      this.calendar.zodiac = data.monthData[0].zodiac
      this.calendar.firstDay = data.firstDay === 0 ? 7 : data.firstDay

      this.setDayInfo(this.cday)
    },
    todayMonth() {
      let data = Calendar.getCalender(this.today.year, this.today.month)
      if (data.hasOwnProperty('error')) {
        Logger.debug("error", data.error, data.msg)
        return
      }

      this.cday = this.today
      this.setMonth(data)
    },
    prevMonth() {
      let tm = new Date(this.cday.year, this.cday.month - 1, this.cday.day)
      let tc = new TimeConverter(tm.setMonth(tm.getMonth() - 1))
      this.cday = {
        month: parseInt(tc.tm.month),
        day: parseInt(tc.tm.day)
      }

      let data = Calendar.getCalender(tc.tm.year, tc.tm.month)
      this.setMonth(data)
    },
    nextMonth() {
      let tm = new Date(this.cday.year, this.cday.month - 1, this.cday.day)
      let tc = new TimeConverter(tm.setMonth(tm.getMonth() + 1))

      let data = Calendar.getCalender(tc.tm.year, tc.tm.month)
      this.setMonth(data)
    },
    boldDay: function(day) {
      let data = {
        'bold-day': this.cday.year === day.year && this.cday.month === day.month && this.cday.day === day.day ? true: false,
        'to-day': this.today.year === day.year && this.today.month === day.month && this.today.day === day.day ? true: false
      }

      return data
    },
    boldFest: function(day) {
      let data = {
        'bold-fest': this.getFest(day).length > 0 ? true: false
      }

      return data
    },
    getFest(day) {
      const keys = ["lunarFestival", "solarFestival", "term"]
      const fest = Calendar.getFestval(day)
      let festArray = []

      keys.forEach((key) => {
        if (typeof(fest[key]) !== 'undefined') {
          festArray.push(fest[key])
        }
      })

      return festArray
    },
    setDayInfo(day) {
      let nday = day.day - 1
      if (this.calendar.monthData.length < nday) {
        nday = this.calendar.monthData.length - 1
      }

      this.cday = this.calendar.monthData[nday]
    },
    dayMore (day) {
      let fest = this.getFest(day)

      if (fest.length > 0) {
        return fest[0].substr(0, 3)
      } else {
        return day.lunarDayName.substr(0, 3)
      }
    }
  },
  created() {
    let tc = new TimeConverter(new Date())
    let data = Calendar.getCalender(tc.tm.year, tc.tm.month)
    this.today = data.monthData[tc.tm.day - 1]
    this.cday = this.today

    this.setMonth(data)
  }
}
</script>
<style lang="scss">
$BOX_WIDTH: 13.5%;

.calendar {
  background: white;
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 50px;
  width: 100%;
}

.week-head {
  display: inline-block;
  width: 100%;
  margin-top: 10px;
  margin: 10px;
}

.week-box {
  height: 50px;
  text-align: left;
  padding: 1px;
  width: $BOX_WIDTH;
  float: left;
}

.day-wrapper {
  display: inline-block;
  margin: 10px;
  width: 100%;
}

.day-box {
  height: 50px;
  width: $BOX_WIDTH;
  border: solid 1px white;
  cursor: pointer;
  float: left;
}

.to-day {
  border: solid 1px red;
}

.bold-day {
  border: solid 1px black;
}

.bold-fest {
  color: red;
}

.operate {
  display: inline-block;
}

.op-btn {
  border: solid 1px black;
  margin-right: 10px;
}

.set-day {
  margin-bottom: 5px;
}

.cal-top {
  border: solid 1px black;
  padding: 5px 10px;
}
</style>

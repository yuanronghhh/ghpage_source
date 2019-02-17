import LunarCalendar from "lunar-calendar"

class Calendar {
  constructor (engine) {
    this.engine = engine
  }

  getFestval(tm) {
    return this.engine.solarToLunar(tm.year, tm.month, tm.day)
  }

  getCalender(year, month) {
    return this.engine.calendar(year, month)
  }
}

export default new Calendar(LunarCalendar)

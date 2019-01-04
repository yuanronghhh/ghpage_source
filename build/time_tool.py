import time
import datetime


def get_day_time(tm):
    """
    获取当天的凌晨时间, 返回是datetime
    """
    if not tm:
        return None

    return tm.date()


def get_msec_from_time(tm=None):
    """
    获取带微妙的标准时间戳, 例如：2018-07-03 10:47:02.620000
    """
    if not tm:
        tm = datetime.datetime.now()
    be = get_std_time_str(tm)
    af = tm.microsecond
    tm_str = "%s.%03d" % (be, af)
    return tm_str


def get_std_time_str(tm):
    """
    将时间转成类似: 2018-07-03 10:45:48  的格式
    """
    return tm.strftime("%Y-%m-%d %H:%M:%S")


def get_std_date(tm):
    """
    获取当前标准时间， 例如： 2018-07-30
    """
    if not tm:
        return None

    return tm.strftime("%Y-%m-%d")


def get_utc_time(tm=None):
    """
    将tm转成utc时间, 默认返回当前utc时间
    """
    if not tm:
        tm = datetime.datetime.now()

    return tm.utcnow()


def get_time_stamp(tm=None):
    """
    将tm转成timestamp, 默认返回当前timestamp
    """
    if not tm:
        return int(time.time())

    return int(time.mktime(tm.timetuple()))


def get_tm_from_stamp(stamp):
    if not stamp:
        stamp = time.time()

    return datetime.datetime.fromtimestamp(stamp)

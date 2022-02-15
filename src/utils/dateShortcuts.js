//日期快捷选项 今天 昨天 近7天 本月 上个月 近3个月
export const dateShortcuts = (proxy) => {
    let now = new Date(); //当前日期
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0; //

    let lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    let lastMonth = lastMonthDate.getMonth();

    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return myyear + "-" + mymonth + "-" + myweekday;
    }

    //获得某月的天数
    function getMonthDays(myMonth) {
        let monthStartDate = new Date(nowYear, myMonth, 1);
        let monthEndDate = new Date(nowYear, myMonth + 1, 1);
        let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }

    //获得本月的开始日期
    function getMonthStartDate() {
        let monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
    }

    // //获得本月的结束日期
    // function getMonthEndDate() {
    //     let days = getMonthDays(nowMonth); //获取当月总共有多少天
    //     let monthEndDate = new Date(nowYear, nowMonth, days);
    //     return formatDate(monthEndDate); //返回当月结束时间
    // }

    //获得上月开始时间
    function getLastMonthStartDate() {
        let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return formatDate(lastMonthStartDate);
    }

    //获得上月结束时间
    function getLastMonthEndDate() {
        let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
        return formatDate(lastMonthEndDate);
    }

    const shortcuts = [
        {
            text: proxy.$t("today"),
            value: (() => {
                let start = new Date();
                start.setTime(start.getTime()); //今天
                start = formatDate(start);
                return [start + "00:00:00", now];
            })()
        },
        {
            text: proxy.$t("yesterday"),
            value: (() => {
                let start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1); //昨天
                start = formatDate(start);
                return [start + "00:00:00", start + "23:59:59"];
            })()
        },
        {
            text: proxy.$t("nearlyDay", { day: 7 }), //近7天
            value: (() => {
                let start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                start = formatDate(start);
                return [start + "00:00:00", now];
            })()
        },
        {
            text: proxy.$t("nearlyDay", { day: 30 }), //近30天
            value: (() => {
                let start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                start = formatDate(start);
                return [start + "00:00:00", now];
            })()
        },
        {
            text: proxy.$t("currentMonth"), //本月
            value: (() => {
                return [getMonthStartDate() + "00:00:00", now];
            })()
        },
        {
            text: proxy.$t("lastMonth"), //上个月
            value: (() => {
                return [getLastMonthStartDate() + "00:00:00", getLastMonthEndDate() + "23:59:59"];
            })()
        },
        {
            text: proxy.$t("nearlyMonth", { month: 3 }), //近3个月
            value: (() => {
                let start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                start = formatDate(start);
                return [start + "00:00:00", now];
            })()
        }
    ];

    return shortcuts;
};

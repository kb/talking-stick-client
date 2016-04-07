package com.talkingstickclient.calendar;

import java.util.Calendar;

public class Util {
    @SuppressWarnings("all")
    public static long endOfDay() {
        Calendar cal = Calendar.getInstance();
        int curDay = cal.get(Calendar.DATE);
        int curMonth = cal.get(Calendar.MONTH);
        int curYear = cal.get(Calendar.YEAR);

        cal = Calendar.getInstance();
        cal.set(curYear, curMonth, curDay, 23, 59, 59);
        return cal.getTimeInMillis();
    }

    @SuppressWarnings("all")
    public static long beginningOfDay() {
        Calendar cal = Calendar.getInstance();
        int curDay = cal.get(Calendar.DATE);
        int curMonth = cal.get(Calendar.MONTH);
        int curYear = cal.get(Calendar.YEAR);

        cal = Calendar.getInstance();
        cal.set(curYear, curMonth, curDay, 23, 59, 59);
        cal.add(Calendar.DATE, -1);
        return cal.getTimeInMillis();
    }
}

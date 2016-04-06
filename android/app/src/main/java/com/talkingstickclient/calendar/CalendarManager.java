package com.talkingstickclient.calendar;
import android.content.ContentUris;
import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CalendarContract;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.Random;


public class CalendarManager extends ReactContextBaseJavaModule {
    public static final String[] INSTANCE_PROJECTION = new String[] {
            CalendarContract.Instances.EVENT_ID,
            CalendarContract.Instances.TITLE,
            CalendarContract.Instances.BEGIN,
            CalendarContract.Instances.END,
    };

    private static final String TAG = "RCTCalendar";

    public CalendarManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CalendarManager";
    }

    @ReactMethod
    public void queryEvents(final Callback callback) {
        Log.d(TAG, "queryEvents called");
        Uri.Builder builder = CalendarContract.Instances.CONTENT_URI.buildUpon();
        ContentUris.appendId(builder, Util.beginningOfDay());
        ContentUris.appendId(builder, Util.endOfDay());
        CursorLoader cursorLoader = new CursorLoader(getReactApplicationContext(),
                builder.build(),
                INSTANCE_PROJECTION,
                null,
                null,
                CalendarContract.Instances.DTSTART + " ASC");
        // TODO what is the listener id for? is it ok that it's random?
        cursorLoader.registerListener(new Random().nextInt(), new Loader.OnLoadCompleteListener<Cursor>() {
            @Override
            public void onLoadComplete(Loader<Cursor> loader, Cursor data) {
                Log.d(TAG, "queryEvents onLoadComplete called");

                WritableNativeArray events = new WritableNativeArray();

                while (data.moveToNext()) {
                    Log.d(TAG, "queryEvents onLoadComplete found event");
                    WritableMap event = new WritableNativeMap();
                    event.putString("id", data.getString(0));
                    event.putString("title", data.getString(1));
                    event.putInt("startTimeMs", (int)data.getLong(2));
                    event.putInt("endTimeMs", (int)data.getLong(3));
                    events.pushMap(event);
                }

                callback.invoke(events);
            }
        });
        cursorLoader.startLoading();
    }
}


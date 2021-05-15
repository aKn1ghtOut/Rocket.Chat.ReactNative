package chat.rocket.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Callback;

import com.ammarahmed.mmkv.SecureKeystore;
import com.tencent.mmkv.MMKV;

import java.math.BigInteger;

class RNCallback implements Callback {
    public void invoke(Object... args) {

    }
}

class Utils {
    static public String toHex(String arg) {
        try {
            return String.format("%x", new BigInteger(1, arg.getBytes("UTF-8")));
        } catch (Exception e) {
            return "";
        }
    }
}

public class Ejson {
    String host;
    String rid;
    String type;
    Sender sender;
    String messageId;
    String notificationType;
    String senderName;
    String msg;

    private String[] pieces = null;

    private MMKV mmkv;

    private String TOKEN_KEY = "reactnativemeteor_usertoken-";

    public Ejson() {
        ReactApplicationContext reactApplicationContext = CustomPushNotification.reactApplicationContext;

        if (reactApplicationContext == null) {
            return;
        }

        // Start MMKV container
        MMKV.initialize(reactApplicationContext);
        SecureKeystore secureKeystore = new SecureKeystore(reactApplicationContext);

        // https://github.com/ammarahm-ed/react-native-mmkv-storage/blob/master/src/loader.js#L31
        String alias = Utils.toHex("com.MMKV.default");

        // Retrieve container password
        secureKeystore.getSecureKey(alias, new RNCallback() {
            @Override
            public void invoke(Object... args) {
                String error = (String) args[0];
                if (error == null) {
                    String password = (String) args[1];
                    mmkv = MMKV.mmkvWithID("default", MMKV.SINGLE_PROCESS_MODE, password);
                }
            }
        });
    }

    private String[] serverInfo() {
        String notifData = null;
        if(pieces == null) {
            String serverUrlString = serverURL();
            notifData = mmkv.decodeString(TOKEN_KEY + serverUrlString + "-notif");

            if(notifData == null) {
                String userId = mmkv.decodeString(TOKEN_KEY.concat(serverUrlString));
                String token = mmkv.decodeString(TOKEN_KEY.concat(userId));
                String encKey = mmkv.decodeString(TOKEN_KEY.concat("-RC_E2E_PRIVATE_KEY"));
                pieces = new String[]{ userId, token, encKey };
            }
            else {
                pieces = notifData.split("|");
            }
        }
        return pieces;
    }

    public String getAvatarUri() {
        if (type == null) {
            return null;
        }
        return serverURL() + "/avatar/" + this.sender.username + "?rc_token=" + token() + "&rc_uid=" + userId();
    }

    public String token() {
        String[] info = serverInfo();
        if(info != null && info.length >= 2) {
            return info[1];
        }
        return "";
    }

    public String userId() {
        String[] info = serverInfo();
        if(info != null && info.length >= 2) {
            return info[0];
        }
        return "";
    }

    public String privateKey() {
        String[] info = serverInfo();
        if(info != null && info.length == 3 && info[2] != null) {
            return info[2];
        }
        return "";
    }

    public String serverURL() {
        String url = this.host;
        if (url != null && url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        return url;
    }

    public class Sender {
        String username;
        String _id;
    }
}

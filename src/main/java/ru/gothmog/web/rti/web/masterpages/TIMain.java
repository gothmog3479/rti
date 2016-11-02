package ru.gothmog.web.rti.web.masterpages;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import java.io.Serializable;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;

/**
 * Created by gothmog on 13.07.2016.
 */
@ManagedBean(name = "timain")
@SessionScoped
public class TIMain implements Serializable {


    public String getCurrentUser() throws NoSuchAlgorithmException {
        String defaultuser = "Неавторизованный пользователь";
//        try {
//            TIUser tiUser = new TIUser();
//
//            if (tiUser != null) {
//                return tiUser.getTiUserName();
//            }else {
//                return "Неавторизованный пользователь";
//            }
//        } catch (Exception ex) {
//
//        }
//        TIUser tiUser = new TIUser();

//        if (tiUser != null) {
//            return tiUser.getTiUserName();
//        } else {
//            return "Неавторизованный пользователь";
//        }
        return defaultuser;
    }

    public String getCurrentServer() throws UnknownHostException {
        InetAddress address = InetAddress.getLocalHost();
        byte[] ipAddr = address.getAddress();
        String hostname = address.getHostName();
        return hostname;
    }

    public void pageLoad(Object sender) {

    }
}

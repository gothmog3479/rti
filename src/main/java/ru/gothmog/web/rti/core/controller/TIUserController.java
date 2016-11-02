package ru.gothmog.web.rti.core.controller;


import ru.gothmog.web.rti.model.entities.registry.auth.TIUser;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by gothmog on 23.08.2016.
 */
@ManagedBean(eager = true)
@ApplicationScoped
public class TIUserController implements Serializable {
    private ArrayList<TIUser> tiUserArrayList;

    public TIUserController() {
    }

    public ArrayList<TIUser> getTiUserArrayList() {
        return tiUserArrayList;
    }

    public void setTiUserArrayList(ArrayList<TIUser> tiUserArrayList) {
        this.tiUserArrayList = tiUserArrayList;
    }
}

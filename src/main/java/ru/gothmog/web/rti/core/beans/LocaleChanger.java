package ru.gothmog.web.rti.core.beans;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import java.io.Serializable;
import java.util.Locale;

/**
 * Created by gothmog on 12.07.2016.
 */

@ManagedBean(eager = true)
@SessionScoped
public class LocaleChanger implements Serializable {
    private Locale currentLocale = FacesContext.getCurrentInstance().getViewRoot().getLocale();

    public LocaleChanger() {
    }

    public void changeLocale(String localeCode) {
        currentLocale = new Locale(localeCode);
    }

    public Locale getCurrentLocale() {
        return currentLocale;
    }
}

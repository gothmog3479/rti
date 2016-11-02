package ru.gothmog.web.rti.web.validators;


import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.xml.bind.ValidationException;

/**
 * Created by gothmog on 23.08.2016.
 */
@ManagedBean
@SessionScoped
public class TIValidator {

    public void validateEmail(FacesContext context, UIComponent toValidate, Object value) throws ValidationException {
        String emailStr = (String) value;
        if (-1 == emailStr.indexOf("@")) {
            FacesMessage message = new FacesMessage(" Не правильный email адресс!");
            throw new ValidationException(String.valueOf(message));
        }
    }


}

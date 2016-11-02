package ru.gothmog.web.rti.model.entities.registry.auth;

import org.apache.log4j.Logger;
import org.jboss.security.Base64Encoder;
import ru.gothmog.web.rti.model.dao.impl.PgSQLTIUserDao;
import ru.gothmog.web.rti.model.entities.registry.structure.TIDepartment;
import ru.gothmog.web.rti.model.entities.registry.structure.TISystemNode;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;

/**
 * Created by gothmog on 13.07.2016.
 */
@ManagedBean
@SessionScoped
public class TIUser implements Serializable {
    private static final Logger log = Logger.getLogger(TIUser.class);
    private MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
    private long tiUserId;
    private String tiUserName;
    private String tiUserPassword;
    private TIUser createTiUser;
    private TIUser lastEditedTiUser;
    private TIDepartment tiDepartment;
    private boolean isActive;
    private Date createDate;
    private Date lastEditedDate;
    private String surName;
    private String firstName;
    private String patronymic;
    private String fullname;
    private TIRole tiRole;
    private TISystemNode tiSystemNode;
    private TIUserProfiles tiUserProfiles;

    private String errorPrefix = "Обработка данных сессии: ";
    private String lastError = "";

    public TIUser() throws NoSuchAlgorithmException {
    }

    public TIUser(String tiUserName, String tiUserPassword) throws NoSuchAlgorithmException {
        this.tiUserName = tiUserName;
        this.tiUserPassword = tiUserPassword;
    }

    public TIUser(long tiUserId, String tiUserName, String tiUserPasword) throws NoSuchAlgorithmException {
        this.tiUserId = tiUserId;
        this.tiUserName = tiUserName;
        this.tiUserPassword = tiUserPasword;
    }

    private void writeObject(ObjectOutputStream outputStream) throws IOException {
        outputStream.writeObject(tiUserId);
        outputStream.writeObject(tiUserName);
        outputStream.writeObject(tiUserPassword);
    }

    private void readObject(ObjectInputStream inputStream) throws IOException, ClassNotFoundException {
        tiUserId = (long) inputStream.readObject();
        tiUserName = (String) inputStream.readObject();
        tiUserPassword = (String) inputStream.readObject();
    }

    public long getTiUserId() {
        return tiUserId;
    }

    public void setTiUserId(long tiUserId) {
        this.tiUserId = tiUserId;
    }

    /**
     * Метод для чтения имени пользователя из переменной
     *
     * @return значение переменной tiUserName
     */
    public String getTiUserName() {
        return tiUserName;
    }

    /**
     * Метод для записи имени пользователя в переменную
     *
     * @param tiUserName новое имя пользователя;
     */
    public void setTiUserName(String tiUserName) {
        this.tiUserName = tiUserName;
    }

    /**
     * Метод для чтения пароля пользователя из переменной
     *
     * @return значение переменной tiUserPassword
     */
    public String getTiUserPasword() {
        return tiUserPassword;
    }

    /**
     * Метод для записи пароля пользователя в переменную
     * с шифрованием SHA-256 64Encode
     *
     * @param tiUserPasword новое имя пользователя;
     */
    public void setTiUserPasword(String tiUserPasword) {
        log.info("encoding password SHA-256");
        try {
            messageDigest.update(tiUserPasword.getBytes("UTF-8"));
            byte[] digest = messageDigest.digest();
            tiUserPasword = Base64Encoder.encode(digest);
        } catch (IOException ex) {
            log.error("Error when encoding SHA-256");
        }
        this.tiUserPassword = tiUserPasword;
    }

    public TIUser getCreateTiUser() {
        return createTiUser;
    }

    public void setCreateTiUser(TIUser createTiUser) {
        this.createTiUser = createTiUser;
    }

    public TIUser getLastEditedTiUser() {
        return lastEditedTiUser;
    }

    public void setLastEditedTiUser(TIUser lastEditedTiUser) {
        this.lastEditedTiUser = lastEditedTiUser;
    }

    public TIDepartment getTiDepartment() {
        return tiDepartment;
    }

    public void setTiDepartment(TIDepartment tiDepartment) {
        this.tiDepartment = tiDepartment;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getLastEditedDate() {
        return lastEditedDate;
    }

    public void setLastEditedDate(Date lastEditedDate) {
        this.lastEditedDate = lastEditedDate;
    }

    public String getSurName() {
        return surName;
    }

    public void setSurName(String surName) {
        this.surName = surName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public TIRole getTiRole() {
        return tiRole;
    }

    public void setTiRole(TIRole tiRole) {
        this.tiRole = tiRole;
    }

    public TISystemNode getTiSystemNode() {
        return tiSystemNode;
    }

    public void setTiSystemNode(TISystemNode tiSystemNode) {
        this.tiSystemNode = tiSystemNode;
    }

    public TIUserProfiles getTiUserProfiles() {
        return tiUserProfiles;
    }

    public void setTiUserProfiles(TIUserProfiles tiUserProfiles) {
        this.tiUserProfiles = tiUserProfiles;
    }

    /**
     * Метод для определения наличия значения в переменной имени пользователя
     *
     * @return истина, если имя пользователя отсутствует
     */
    public boolean isEmpty() {
        return tiUserName.trim().isEmpty();
    }

    /**
     * Метод логирования в систему
     *
     * @return истина, если пароль и пользователь пресутсвуют в базе
     * переход на страницу
     * фальш на страницу входа в систему
     */
    public String loginTiUser() throws IOException {
        PgSQLTIUserDao pgSQLTIUserDao = new PgSQLTIUserDao();
        boolean loginTiUser = pgSQLTIUserDao.login(tiUserName, tiUserPassword);
        if (loginTiUser) {
            HttpSession session = SessionBean.getSession();
            session.setAttribute("tiUserName", tiUserName);
            session.setAttribute("tiUserPassword", tiUserPassword);
            return "default";
        }
        return "login";
    }

    public String processExit() {
        tiUserName = null;
        tiUserPassword = null;
        tiUserId = 0;
        return "index";
    }

    public String processLogin() {
        return "login";
    }


}

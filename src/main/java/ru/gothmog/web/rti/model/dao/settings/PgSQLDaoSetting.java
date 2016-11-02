package ru.gothmog.web.rti.model.dao.settings;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by gothmog on 16.07.2016.
 */
public final class PgSQLDaoSetting implements DaoSetting {
    private final static Logger log = Logger.getLogger(PgSQLDaoSetting.class);
    private final static String URL = "jdbc:postgresql://localhost:5435/ti_release";
    private final static String USERNAME = "postgres";
    private final static String PASSWORD = "12345678";
    private final static String DRIVER = "org.postgresql.Driver";

    public PgSQLDaoSetting() {
        try {
            Class.forName(getDRIVER());
        } catch (ClassNotFoundException ex) {
            log.error("Ошибка регистрации PostgreSQL driver ", ex);
        }
    }

    public static String getURL() {
        return URL;
    }

    public static String getUSERNAME() {
        return USERNAME;
    }

    public static String getPASSWORD() {
        return PASSWORD;
    }

    public static String getDRIVER() {
        return DRIVER;
    }

    @Override
    public final Connection getConnection() throws SQLException, IOException {
        return DriverManager.getConnection(getURL(), getUSERNAME(), getPASSWORD());
    }
}

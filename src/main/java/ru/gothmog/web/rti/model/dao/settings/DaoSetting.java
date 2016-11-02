package ru.gothmog.web.rti.model.dao.settings;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by gothmog on 16.07.2016.
 */
public interface DaoSetting {
    Connection getConnection() throws SQLException, IOException;
}

package ru.gothmog.web.rti.model.dao.impl;

import org.apache.log4j.Logger;
import ru.gothmog.web.rti.model.dao.TiUserDao;
import ru.gothmog.web.rti.model.dao.settings.PgSQLDaoSetting;
import ru.gothmog.web.rti.model.entities.registry.auth.TIUser;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by gothmog on 16.07.2016.
 */
public class PgSQLTIUserDao implements TiUserDao {
    private final static Logger log = Logger.getLogger(PgSQLTIUserDao.class);
    private PgSQLDaoSetting pgSQLDaoSetting = new PgSQLDaoSetting();

    @Override
    public boolean create(TIUser tiUser) throws IOException {
        log.info("Create new user");
        boolean result = false;
        String sql = "INSERT INTO ti.users(tiusername, tiuserpassword) " +
                " VALUES (?, ?)";

        try (Connection connection = pgSQLDaoSetting.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, tiUser.getTiUserName());
            statement.setString(2, tiUser.getTiUserPasword());

            int rowsInsert = statement.executeUpdate();
            if (rowsInsert > 0) {
                log.info("A new user was created successfully!");
                result = true;
            }
        } catch (SQLException ex) {
            log.error("Error when creating new user", ex);
        }
        return result;
    }

    @Override
    public boolean update(long tiUserId, String tiUserName, String tiUserPassword) throws IOException {
        log.info("Update user");
        String sql = "UPDATE ti.users SET ti.users.tiusername = ?, " +
                " ti.users.tiuserpassword = ? WHERE ti.users.tiusersid = ?";
        boolean result = false;

        try (Connection connection = pgSQLDaoSetting.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, tiUserName);
            statement.setString(2, tiUserPassword);
            statement.setLong(3, tiUserId);

            int rowsUpdated = statement.executeUpdate();
            if (rowsUpdated > 0) {
                log.info("An existing user was updated successfully!");
                result = true;
            }
        } catch (SQLException ex) {
            log.error("Error when update user data", ex);
        }

        return result;
    }

    @Override
    public void delete(long tiUserId) throws IOException {
        log.info("Delete user");
        String sql = "DELETE FROM ti.users WHERE ti.users.tiusersid= ?";

        try (Connection connection = pgSQLDaoSetting.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, tiUserId);

            int rowsDelete = statement.executeUpdate();
            if (rowsDelete > 0) {
                log.info("A user was deleted successfully!");
            }
        } catch (SQLException ex) {
            log.error("Error delete user", ex);
        }
    }

    @Override
    public TIUser read(long tiUserId) throws NoSuchAlgorithmException, IOException {
        log.info("Read user");
        TIUser tiUser = new TIUser();
        String sql = "SELECT * FROM ti.users WHERE ti.users.tiusersid= ?";

        try (Connection connection = pgSQLDaoSetting.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, tiUserId);
            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            tiUser.setTiUserId(resultSet.getLong("tiUserId"));
            tiUser.setTiUserName(resultSet.getString("tiUserName"));
            tiUser.setTiUserPasword(resultSet.getString("tiUserPassword"));
            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException ex) {
            log.error("Error when reading user's data", ex);
        }
        return tiUser;
    }

    @Override
    public boolean login(String tiUserName, String tiUserPassword) throws IOException {
        log.info("Login user");
        boolean result = false;
        String sql = "SELECT ti.users.tiusername, ti.users.tiuserpassword FROM ti.users WHERE ti.users.tiusername = ? AND ti.users.tiuserpassword = ?";

        try (Connection connection = pgSQLDaoSetting.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, tiUserName);
            statement.setString(2, tiUserPassword);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                log.info("An existing user was validate successfully!");
                result = true;
            }
            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException ex) {
            log.error("Login error", ex);
        }
        return result;
    }

    @Override
    public List<TIUser> getAll() throws IOException, NoSuchAlgorithmException {
        log.info("Get all users");
        List<TIUser> tiUserList = new ArrayList<>();
        String sql = "SELECT ti.users.tiusername, ti.users.tiuserpassword FROM ti.users ORDER BY ti.users.tiusername";

        try (Connection connection = pgSQLDaoSetting.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                TIUser tiUser = new TIUser();
                tiUser.setTiUserId(resultSet.getLong("tiUserId"));
                tiUser.setTiUserName(resultSet.getString("tiUserName"));
                tiUser.setTiUserPasword(resultSet.getString("tiUserPassword"));
                tiUserList.add(tiUser);
            }

        } catch (SQLException ex) {
            log.error("Error when getting all users", ex);
        }
        return tiUserList;
    }

}

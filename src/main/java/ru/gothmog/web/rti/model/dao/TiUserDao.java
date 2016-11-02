package ru.gothmog.web.rti.model.dao;

import ru.gothmog.web.rti.model.entities.registry.auth.TIUser;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 * Created by gothmog on 16.07.2016.
 */
public interface TiUserDao {
    boolean create(TIUser tiUser) throws IOException;

    boolean update(long tiUserId, String tiUserName, String tiUserPassword) throws IOException;

    void delete(long tiUserId) throws IOException;

    TIUser read(long tiUserId) throws NoSuchAlgorithmException, IOException;

    boolean login(String tiUserName, String tiUserPassword) throws IOException;

    List<TIUser> getAll() throws IOException, NoSuchAlgorithmException;
}

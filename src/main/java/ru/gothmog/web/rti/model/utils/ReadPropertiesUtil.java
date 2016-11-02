package ru.gothmog.web.rti.model.utils;

import org.apache.log4j.Logger;

import java.util.ResourceBundle;

/**
 * Created by gothmog on 13.07.2016.
 */
public class ReadPropertiesUtil {
    private static final Logger LOGGER = Logger.getLogger(ReadPropertiesUtil.class);
    /**
     * Properties file name.
     */
    private static final String FILENAME = "resources/messages";
    /**
     * Resource bundle.
     */
    private static ResourceBundle resourceBundle = ResourceBundle.getBundle(FILENAME);

    /**
     * Method to read the property value.
     *
     * @param key
     * @return
     */
    public static String getProperty(final String key) {
        String str = null;
        if (resourceBundle != null) {
            str = resourceBundle.getString(key);
            LOGGER.debug("Value found: " + str + " for key: " + key);
        } else {
            LOGGER.debug("Properties file was not loaded correctly!!");
        }
        return str;
    }
}

package ru.gothmog.web.rti.model.entities.registry.structure;

import org.apache.log4j.Logger;

import java.io.Serializable;
import java.sql.Date;

/**
 * Created by gothmog on 19.08.2016.
 */
public class TIDivision implements Serializable{
    private static final Logger log = Logger.getLogger(TIDivision.class);
    private long tiDivisionId;
    private Date createDate;

}

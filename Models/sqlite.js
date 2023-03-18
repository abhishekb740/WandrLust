const sqlite3 = require("sqlite3").verbose();

exports.connect = () => {
  return new sqlite3.Database("./database/database.db", (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Database Connected Successfully!");
    }
  });
};

exports.createTable = (db) => {
  db.run(`create table if not exists account
    (
        name        varchar(320) not null,
        email       varchar(30)  not null,
        phonenumber long integer not null,
        username    varchar(30)  not null
            constraint account_pk
                primary key,
        
        password    varchar(30)  not null,
        age         integer      not null,
        gender      varchar(10)
    );`,(error)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log("Account Table created Successfully");
        }
    });
};



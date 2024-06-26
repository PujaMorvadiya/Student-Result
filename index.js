var express = require("express");
var mysql = require("mysql2");
var parser = require("body-parser");
var app = express();
var port = 5005;

app.set("view engine", "ejs");
app.use(parser.json());
app.use(express.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@258",
  database: "db_26",
});
con.connect((err) => {
  if (err) throw err;
  console.log("Connected!!");
});

app.get("/", (req, res) => {
  let q1 = `select student_master26.id, student_master26.firstname,sum(exam_result.theory_obtain_mark) as Theory,sum(exam_result.prac_total_mark) as Practical from student_master26 join exam_result
on student_master26.id=exam_result.stu_id where exam_result.exam_id=1 group by student_master26.id;`;
  let q2 = `select sum(exam_result.theory_obtain_mark) as Th2,sum(exam_result.prac_total_mark) as Prac2 from student_master26 join exam_result
on student_master26.id=exam_result.stu_id where exam_result.exam_id=2 group by student_master26.id`;
  let q3 = `select sum(exam_result.theory_obtain_mark) as Th3,sum(exam_result.prac_total_mark) as Prac3 from student_master26 join exam_result
on student_master26.id=exam_result.stu_id where exam_result.exam_id=3 group by student_master26.id;`;
  let q4 = ` select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
on student_master26.id=exam_result.stu_id group by student_master26.id;`;
  let q5 = ` SELECT count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
INNER JOIN att_master26 ON student_master26.id=att_master26.stu_id GROUP BY student_master26.id ; `;

  con.query(q1, (err, result1) => {
    if (err) throw err;
    // console.log(result1);
    con.query(q2, (err, result2) => {
      if (err) throw err;
      // console.log(result2);
      con.query(q3, (err, result3) => {
        if (err) throw err;
        // console.log(result3, field);
        console.log(result3[3]);
        con.query(q4, (err, result4) => {
          if (err) throw err;
          console.log(result4);
          con.query(q5, (err, result5) => {
            if (err) throw err;
            console.log(result5);
            res.render("home", {
              users: result1,
              user2: result2,
              user3: result3,
              user4: result4,
              user5: result5,
            });
          });
        });
      });
    });
  });
});

app.get("/data/:id", (req, res) => {
  let id = req.params.id;
  let q1 = `select student_master26.id, student_master26.firstname,count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT, 
round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
INNER JOIN att_master26 ON student_master26.id=att_master26.stu_id where student_master26.id=${id} GROUP BY student_master26.id ;`;
  let q2 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=1 ;`;
  let q3 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=2 ;`;
  let q4 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=3 ;`;
  let q5 = `select sub_id,student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
on student_master26.id=exam_result.stu_id group by student_master26.id,sub_id;`;
  let q6 = ` select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
on student_master26.id=exam_result.stu_id where student_master26.id=${id};`;
  // con.query(q1, (err, result1) => {
  con.query(q1, (err, ans1) => {
    if (err) throw err;
    console.log(ans1);
    con.query(q2, (err, ans2) => {
      if (err) throw err;
      console.log(ans2);
      con.query(q3, (err, ans3) => {
        if (err) throw err;
        console.log(ans3);
        con.query(q4, (err, ans4) => {
          if (err) throw err;
          console.log(ans4);
          con.query(q5, (err, ans5) => {
            if (err) throw err;
            console.log(ans5);
            con.query(q6, (err, ans6) => {
              if (err) throw err;
              console.log("Answer 6:", ans6);
              res.render("data", {
                key1: ans1,
                key2: ans2,
                key3: ans3,
                key4: ans4,
                key5: ans5,
                key6: ans6,
              });
            });
          });
        });
      });
    });
  });
});

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server is Listing on port : ${port} `);
  } else {
    console.log(`Error is : ${err}`);
  }
});

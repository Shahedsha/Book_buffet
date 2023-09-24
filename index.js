const mongoose=require("mongoose");
const bodyParser=require("body-parser")
const express=require("express");
const BooksModel=require("./models/books");
const WishModel=require("./models/wish");
const User=require("./models/user");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
const cookieparser = require('cookie-parser')
const app=express();
const PORT=305;

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieparser())

const dbUrl="mongodb+srv://Shahid:idiot@mongo.yv6djp0.mongodb.net/E-Books?retryWrites=true&w=majority";
const connectionParams={
    useNewUrlParser:true,
    useUnifiedTopology:true
};
mongoose
    .connect(dbUrl,connectionParams)
    .then(()=>{
        console.info("connected to db");
    })
    .catch(()=>{
        console.log("Errror:",e);
    });



app.listen(PORT,()=>{
        console.log(`Listening on PORT: ${PORT}`)
    })

     app.get("/",(req,res)=>{
        var user= req.cookies.Userstatus;
        BooksModel.find()
        .then(result=>{
            res.render("index",{data:result,data1:user});
        })
     })
     
     app.get("/login",(req,res)=>{
        res.render("login")
     }) 



     app.get("/wish",(req,res)=>{
        var user= req.cookies.Userstatus;
        WishModel.find()
        .then(result=>{
        res.render("wish",{data:result,data1:user})
        })
     })
     
     app.get("/wish/:id/",(req,res)=>{

        BooksModel.findById(req.params.id)
        .then((result)=>{
            var a=result.url ;
            var b=result.bookurl ;
            var c=result.title ;
            var d=result.year ;
            var e=result.cert ;
            var f=result.pages ;
            var g=result.author ;
            var h=result.rating ;
            var i=result.type1 ;
            var j=result.type2 ;
            var k=result.special ;
        




        var booksModel=new WishModel()
        booksModel.url=a;
        booksModel.bookurl=b;
        booksModel.title=c;
        booksModel.year=d;
        booksModel.cert=e;
        booksModel.pages=f;
        booksModel.author=g;
        booksModel.rating=h;
        booksModel.type1=i;
        booksModel.type2=j;
        booksModel.special=k;

        booksModel.save()
        .then((data)=>{
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err);
        })
     })
    })
    

     app.post("/login",(req,res)=>
     {
        const email=req.body.email
        const password=req.body.password
        console.log(req.body.email)
        User.findOne({email:req.body.email})
            .then((result)=>{
                if(result){
                    if(password==result.password){
                        const result1=result
                        res.cookie("Userstatus",email)
                        var k = req.cookies.Userstatus;
                        localStorage.setItem(email,JSON.stringify(result));
                        BooksModel.find()
                        .then(result=>{
                            res.redirect("/");
                        })
                    }
                    else{
                        res.json("Enter correct password")
                    }
                }
                else{
                    res.render("register")
                }
            })
    })

    app.get("/logout",(req,res)=>{
        var user = req.cookies.Userstatus;
          localStorage.removeItem(user)
          res.clearCookie("Userstatus");
            res.redirect("/");
    })

    app.get("/register",(req,res)=>{
          
        res.render("register");
    })
    app.post("/register",(req,res)=>
    {
        const name=req.body.name
        const email=req.body.email
        const password=req.body.password
        User.findOne({ email:req.body.email})
        .then((result)=>{
        
            if(result){
              res.render("login",{data:result})
            }
            else{
                  const user=new User()
                  user.name=req.body.name;
                  user.email=req.body.email;
                  user.password=req.body.password;
                  user.phone=req.body.phone;
                  user.save()
                  res.redirect("/login")
              }
            })
        })

        app.post("/",(req,res)=>{
        var channelModel=new ChannelModel()
        channelModel.todo=req.body.Todo;
        channelModel.save()
        .then((data)=>{
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err);
        })
    })

     app.get("/addbooks",(req,res)=>{
        res.render("add");
     })

     app.post("/addbook",(req,res)=>{
        var booksModel=new BooksModel()
        booksModel.url=req.body.url;
        booksModel.bookurl=req.body.bookurl;
        booksModel.title=req.body.title;
        booksModel.year=req.body.year;
        booksModel.cert=req.body.cert;
        booksModel.pages=req.body.pages;
        booksModel.author=req.body.author;
        booksModel.rating=req.body.rating;
        booksModel.type1=req.body.type1;
        booksModel.type2=req.body.type2;
        booksModel.special=req.body.special;

        booksModel.save()
        .then((data)=>{
            res.redirect("/");
        })
        .catch((err)=>{
            console.log(err);
        })
    })
    
    // app.post("/",(req,res)=>{
    //     var channelModel=new ChannelModel()
    //     channelModel.todo=req.body.Todo;
    //     channelModel.save()
    //     .then((data)=>{
    //         res.redirect("/");
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // })
    
    app.get("/deletebook/:id",(req,res)=>{
        BooksModel.findByIdAndDelete(req.params.id)
        .then(()=>{
            return res.redirect('/')
        })
        .catch((err)=>{
            return res.status(500).send(err)
        })
    })
    
  
    // app.get("/delete/:id",(req,res)=>{
    //     ChannelModel.findByIdAndDelete(req.params.id)
    //     .then(()=>{
    //         return res.redirect('/')
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
    // })

    app.get("/search/:type1",(req,res)=>{
        // BooksModel.findById(req.params.id)
        var user= req.cookies.Userstatus;
        BooksModel.find({
            $or: [{ type1:req.params.type1}, {type2:req.params.type1 }]
        })
        .then((result)=>{
            res.render("index",{data:result,data1:user})
        })
        .catch((err)=>{
            console.log(err)
        })
    })



    app.post("/searchbar",(req,res)=>{
        // BooksModel.findById(req.params.id)
        var user= req.cookies.Userstatus;
        BooksModel.find({
            $or: [{ type1:req.body.search}, {type2:req.body.search}, {title:req.body.search}, {author:req.body.search}]
        })
        .then((result)=>{
            res.render("index",{data:result,data1:user})
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    
  
    app.get("/updatebook/:id",(req,res)=>{
        BooksModel.findById(req.params.id)
        .then((result)=>{
            res.render("update",data=result)
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    
    app.post("/update/book/:id",(req,res)=>{
        const a=req.body.url;
        const b=req.body.bookurl;
        const c=req.body.title;
        const d=req.body.year;
        const e=req.body.cert;
        const f=req.body.pages;
        const g=req.body.author;
        const h=req.body.rating;
        const i=req.body.type1;
        const j=req.body.type2;
        const k=req.body.special;
        
         BooksModel.findByIdAndUpdate(req.params.id,{url:a,bookurl:b,title:c,year:d,cert:e,pages:f,author:g,rating:h,type1:i,type2:j,special:k})

        .then(()=>{
            res.redirect("/");
        })
        .catch((err)=>console.log(err));
    })


    // app.get("/update/:id",(req,res)=>{
    //     ChannelModel.findById(req.params.id)
    //     .then((result)=>{
    //         res.render("update",data=result)
    //     })
    //     .catch((err)=>{
    //         console.log(err)
    //     })
    // })
    
    // app.post("/update/todo/:id",(req,res)=>{
    //     const a=req.body.Todo;
    //      ChannelModel.findByIdAndUpdate(req.params.id,{todo:a})

    //     .then(()=>{
    //         res.redirect("/");
    //     })
    //     .catch((err)=>console.log(err));
    
    
    // })









    // router.put('/updateuser/:id', function(req, res) {
    //     var db = req.db;
    //     var userToUpdate = req.params.id;
    //     db.collection('userlist').update({ _id: ObjectId(userToUpdate)}, req.body, function (err, result) {
    //         res.send(
    //             (err === null) ? {msg: ''} : {msg: err}
    //         );
    //     });
    // });




    // app.get("/insert",(req,res)=>{
    //     var channelModel=new ChannelModel()
    //     channelModel.name="SHAHID2"
    //     channelModel.type="USER"
    //     channelModel.save()
    //     .then((data)=>{
    //         res.status(200).send({"msg":"Inserted to db"})
    //     })
    //     .catch((err)=>{
    //         console.log(err)
    //     })
    // })

    // app.get("/read",(req,res)=>{
    //     ChannelModel.find()
    //     .then((data)=>{
    //         return res.status(200).send(data)
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
        
    // })

    // app.get("/update",(req,res)=>{
    //     ChannelModel.findByIdAndUpdate(req.query.id,{type:req.query.type})
    //     .then((data)=>{
    //         return res.status(200).send(data)
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
        
    // })

    // app.get("/delete",(req,res)=>{
    //     ChannelModel.findOneAndRemove({type:req.query.type})
    //     .then((data)=>{
    //         return res.status(200).send(data)
    //     })
    //     .catch((err)=>{
    //         return res.status(500).send(err)
    //     })
    // })
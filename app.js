const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({entended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema={
  name:String
}
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"welcome to your to-do list"
});
const item2=new Item({
  name:"hit the + button to add a new item"
});
const item3=new Item({
  name:"<--Hit this to delete an item"
});
const defaultItems=[item1,item2,item3];

app.get("/",function(req,res){

  var today=new Date();
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  }
  var day=today.toLocaleDateString("en-Us",options);

  Item.find({},function(err,foundItems){
    if(foundItems.length===0)
    {
      Item.insertMany(defaultItems,function(err){
        if(err)
        {console.log(err);}
        else
        {
          console.log("successfully saved items to database");
        }
      });
      res.redirect("/");       //to get access to the else statement
    }
    else
      res.render("list",{kindOfDay:day,newListItems:foundItems});
  });

});

app.post("/delete",function(req,res){
  checkedItemID=(req.body.checkbox);
  Item.findByIdAndRemove(checkedItemID,function(err){
    if(!err)
    {
      console.log("successfully deleted the item");
      res.redirect("/");
    }
  });
});

app.post("/",function(req,res){
  const itemName= req.body.newItem;
  const item=new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
});

app.listen(3000,function(){
  console.log("server is running on port 3000");
});

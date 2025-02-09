const express= require("express");
const app= express();

const fs= require("node:fs");

app.use(express.json());

const filePath ="books.json";

//VERİ OKUMA
const readData = () =>{
    const jsonData = fs.readFileSync(filePath);
    return JSON.parse(jsonData);
};

// // VERİ YAZMA
const writeData =(books) =>{
 fs.writeFileSync(filePath, JSON.stringify(books, null, 2 ));
};

//GET
app.get("/", (req,res)=>{
    
   const data = readData();
   res.json(data);
});

// KİTAPLARI LİSTELE
app.get("/books", (req,res)=>{
    const data = readData();
    const myBooks= data.map(books =>books.title);
    res.json(myBooks);
   
 });
//POST ----------title kontrol yapılamadı
app.post("/", (req,res) =>{
    let body= req.body;
    let books = readData()
    let arr1= books.filter((book) => book.title==body.title)
    
    if( arr1){
        newBookId = Object.keys(books).length;
        newBookId++;
        newBook={id:newBookId, ...body};
        books =[...books, newBook ];
        fs.writeFileSync(filePath, JSON.stringify(books, null, 2 ));
        res.json(books);
    }
     
});

//PUT update -----------çalışmıyor
app.put("/:bookId", (req, res) => {
    const {bookId} = req.params;
    let {title,author,year,genre,pages}= req.body;
    
    const data = readData();
    const findBook = data.find((book)=> book.id == bookId);
    if(findBook){
        books=data.map((book)=>{
            if(book.id==bookId){
                // return{title,author,year,genre,pages};
                writeData(...books,book)
            }
        })
        res.json({success:true, book});
    }
    else
    {
       res.json({success:false, message:"kitap bulunamadı"});
    }
    
  });

//DELETE
app.delete("/:bookId", (req, res) => {
    const { bookId } = req.params;
    let books = readData();
    let nId =req.params.bookId;
    let nBook =books.find((book) => book.id==nId);
    if(nBook){
        books = books.filter((book) => book.id !== Number(bookId));
        writeData(books)
        res.status(204).json(books);

    }
    else{
        res.status(404).send("böyle bir kitap yok...")
    }
    
  });    

const PORT = 3000;
app.listen(PORT, ()=>{

    console.log(`sunucu  ${PORT} portunda çalışıyor`);  

});
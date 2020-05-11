let express = require("express");
let path = require("path");
let app = express();
const fs = require("fs");
const util = require("util");
const PORT = process.env.PORT || 80
const public_dir = __dirname + `/public/`;
const output_dir = __dirname + `/db/`;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const writeFileAsync = util.promisify(fs.writeFile);

/*HTML ROUTES */
app.get("/notes", function(req, res) {
  res.sendFile(path.join(public_dir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
 res.send(readFile());
});

app.post("/api/notes", function(req, res) {
  saved_notes = readFile();
  console.log(saved_notes.length);
  let current_note = req.body;
  current_note.id = JSON.stringify(saved_notes.length);
  saved_notes.push(req.body);
  let json = JSON.stringify(saved_notes);
  res.send(writeFile(json));
});

app.delete("/api/notes/:id", function(req, res) {
  let id = req.params.id;
  saved_notes = readFile();
  saved_notes.forEach(function (note,i) {
    if(note.id == id)
    {
    saved_notes.splice(i,1);
    let json = JSON.stringify(saved_notes);
    writeFile(json);
    }
  }); 
  res.send(id);
});

app.get("*", function(req, res) {
  res.sendFile(path.join(public_dir, "index.html"));
});

async function writeFile(data)
      {  
          try {
              await writeFileAsync(path.join(output_dir, "db.json"), data);
              console.log('SUCCESS: db.json is created');
          }
          catch(error) {
              console.error('ERROR WHEN WRITING FILE: ' + error);
              return false;
          }
      }

function readFile()
{
  try {
    return JSON.parse(fs.readFileSync(path.join(output_dir, "db.json")));
  }
  catch{
    return  [];
  }
}

/* Server */
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

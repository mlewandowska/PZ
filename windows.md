<h1> Instalacja NodeJS i uruchomienie MindMap na Windows Vista/7 </h1>

instalacja NodeJS

Należy pobrać plik instalacyjny [NodeJS](http://nodejs.org/download/ "NodeJS") dla systemu Windows.
Następnie trzeba wykonać instalację według instukcji zawartych w instalatorze.

instalacja MongoDB
Należy pobrać plik instalacyjny [MongoDB](http://www.mongodb.org/downloads "MongoDB") dla systemu Windows. 
Po rozpakowaniu pobranego archiwum z MongoDB należy upewnić się że pliki znajdują się w folderze <strong>c:\mongo</strong>.
MongoDB wymaga folderu na dane, który trzeba stworzyć. W tym celu w menu start należy wpisać: <strong>cmd</strong>, następnie uruchomić program command prompt z uprawnieniami administratora 
(prawym przyciskiem myszy kliknąć na program command prompt a następnie wybrać uruchom jako administrator).
Tworzenie folderu na dane w oknie command prompt:
```sh
cd C:\
md data
md data\db
```

W celu uruchomienia programu mongod wpisujemy w oknie command prompt:
```sh
C:\mongodb\bin\mongod.exe
```
Uruchomienie MindMap

Aby uruchomić MindMap należy z menu start otworzyć konsole NodeJS. 
W otwartej konsoli należy przejść do folderu z aplikacją MindMap
Przy pierwszym uruchomieniu wymagane jest pobranie potrzebnych zależności poleceniem:

```sh
npm install
```
Po udanym pobraniu zależności uruchomienie aplikacji:

```sh
node app.js
```

Aplikacja działa pod adresem [MindMap](http://localhost:3000)


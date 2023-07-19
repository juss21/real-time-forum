#### REAL-TIME-FORUM    
    
README in progress...   
    
todo:   

todo järk #1: real-time chat send/receive        
todo järk #1.5: like&dislike  
todo järk #3: postituste/commentite tegemine -> vajab kõvasti lihvimist


        
bugid:

kui kasutajate vahelist vestlust pole viskab errori:
```
{"UserName":"uus","ReceiverName":"joel","Messages":null}
Uncaught (in promise) TypeError: Cannot read properties of null (reading 'forEach')
    at createChat (messenger.js:89:22)
    at routeEvent (websocket.js:38:13)
    at socket.onmessage (websocket.js:15:13)
```    
kui sõnumit saata    
```
{"UserName":"123","ReceiverName":"eqwr","Messages":[{"UserName":"123","ReceivingUser":"eqwr","MessageDate":"July 12, 2023 at 17:51","Message":"tere"}]}
websocket.js:14 {"userName":"123","receivingUser":"eqwr","messageDate":"July 15, 2023 at 02:22","message":"aed","type":"send_message"}
Uncaught (in promise) SyntaxError: "[object Object]" is not valid JSON
    at JSON.parse (<anonymous>)
    at routeEvent (websocket.js:37:36)
    at sendMessage (messenger.js:146:9)
    at HTMLTextAreaElement.<anonymous> (messenger.js:103:13)
messenger.js:89 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'forEach')
    at createChat (messenger.js:89:22)
    at routeEvent (websocket.js:38:13)
    at socket.onmessage (websocket.js:15:13)
```


later: css      
    

üle vaadata:
done* registeri tühjad inputid kontrolli alla saada     

hiljem, kui aega ja igav on: 
fix: f5 refresh?    


### Authors [juss](https://01.kood.tech/git/juss) & [kasepuu](https://01.kood.tech/git/kasepuu) 
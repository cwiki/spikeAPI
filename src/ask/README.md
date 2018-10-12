# Askilisk

Group based permission system build around easy to use sentance sytle syntax


```js
const askilisk = require(...)
const ask =  askilisk()
// Setup ASK
ask.allow('user').to('fight')
// example user/context
let Milo = { groups: ['user'] }
// Check Permissions
ask.canUser(Milo).read('fight') // true
ask.canUser(Milo).read('flight') // false
```

# API


## askilisk
```js
askilisk([storage<object>]): ask<object>
```
Creates a new instance of __ask__.

## ask.allow()
Allows for all action to be performed (create/read/update/delete)<br>
```js
ask.allow(group<String>).to(action<String>)
```

Allows for respective action to bperformed <br>
```js
__ask.allow(group<String>).toCreate(action<String>)__<br>
__ask.allow(group<String>).toRead(action<String>)__<br>
__ask.allow(group<String>).toUpdate(action<String>)__<br>
__ask.allow(group<String>).toDelete(action<String>)__<br>
```

Disallows for respective action to bperformed <br>
```js
__ask.allow(group<String>).notToCreate(action<String>)__<br>
__ask.allow(group<String>).notToRead(action<String>)__<br>
__ask.allow(group<String>).notToUpdate(action<String>)__<br>
__ask.allow(group<String>).notToDelete(action<String>)__<br>
```


## ask.canUser() && ask.can()
Checks to see if a set of groups allows for actions <br>
```js
__ask.can(groups<Object>).create(action<String>)__<br>
__ask.can(groups<Object>).read(action<String>)__<br>
__ask.can(groups<Object>).update(action<String>)__<br>
__ask.can(groups<Object>).delete(action<String>)__<br>
```

Checks to see if a user (with groups) is allowed for actions <br>
```js
ask.canUser(Object.groups<Object>).create(action<String>)
ask.canUser(Object.groups<Object>).read(action<String>)
ask.canUser(Object.groups<Object>).update(action<String>)
ask.canUser(Object.groups<Object>).delete(action<String>)
```

__.when(context<String>)__ is a modifier that allows the application of context<br>
the __when__ modifier can be added after the can statement to imploy context.  
This would represent a type kind of subtype for the can statement <br>
```js
ask.canUser(...).when(context<String>).read(...)

// user can read the paper IF they are in the tokyo group
// is also true if the user has no context contraints
ask.allow('journalist').toRead('paper')
ask.allow('dancer').toRead('dance')
japanUser = {
    journalist: ['japan'],
    dancer: ''
}
ask.canUser(japanUser).when('japan').read('paper') // true
ask.canUser(japanUser).when('china').read('paper') // false

ask.canUser(japanUser).when('japan').read('dance') // true
ask.canUser(japanUser).when('china').read('dance') // true

```


## Groups Object
Ask relies of the application to provide a groups context.
This may be on a user object. The groups<object> should contain group names as keys. With modifiers as array values.

```js
groups = {
    group: ['context', 'modifier'],
    group2: 1, // group memeber
    group3: '', // also a group member
    group4: false, // still a group member
}

groups // use with can(groups)
User.groups = groups // use with canUser(User)
```
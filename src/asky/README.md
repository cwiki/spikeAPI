# Asky

Group based permission system build around easy to use sentance sytle syntax


```js
const asky = require(...)
const ask =  asky()
// Setup ASK
ask.allow('user').to('fight')
// example user/context
let Milo = { groups: ['user'] }
// Check Permissions
ask.canUser(Milo).read('fight') // true
ask.canUser(Milo).read('flight') // false
```

# API


## Asky
```js
asky([storage<object>]): ask<object>
```
Creates a new instance of __ask__.

## ask.allow()
Allows for all action to be performed (create/read/update/delete)<br>
```js
ask.allow(group<String>).to(action<String>)
```

Allows for respective action to bperformed <br>
```js
ask.allow(group<String>).toCreate(action<String>)
ask.allow(group<String>).toRead(action<String>)
ask.allow(group<String>).toUpdate(action<String>)
ask.allow(group<String>).toDelete(action<String>)
```

Disallows for respective action to bperformed 
```js
ask.allow(group<String>).notToCreate(action<String>)
ask.allow(group<String>).notToRead(action<String>)
ask.allow(group<String>).notToUpdate(action<String>)
ask.allow(group<String>).notToDelete(action<String>)
```


## ask.canUser() && ask.can()
Checks to see if a set of groups allows for actions 
```js
ask.can(groups<Object>).create(action<String>)
ask.can(groups<Object>).read(action<String>)
ask.can(groups<Object>).update(action<String>)
ask.can(groups<Object>).delete(action<String>)
```

Checks to see if a user (with groups) is allowed for actions 
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

// PAPER
ask.canUser(japanUser).read('paper') // true
ask.canUser(japanUser).when('japan').read('paper') // true
ask.canUser(japanUser).when('china').read('paper') // false

// DANCE
ask.canUser(japanUser).read('dance') // true
ask.canUser(japanUser).when('japan').read('dance') // true
ask.canUser(japanUser).when('china').read('dance') // true

```


## Groups Object
Ask relies of the application to provide a groups context.
This may be on a user object. The groups<object> should contain group names as keys. With modifiers as array values.

```js
groups = {
    group: ['context', 'modifier'], // group member, but can be scoped
    group2: 1, // group memeber
    group3: '', // also a group member
    group4: false, // still a group member
}
// if there is no scope then all scopes are accepted

groups // use with can(groups)
User.groups = groups // use with canUser(User)
```

## Duplicate Permissions
**_We recommend avoiding duplicate permissions_**  
If you decide to duplicate permissions they are optimistically scoped.
```js
ask.allow('user').to('jump').notTo('read')
ask.allow('admin').to('jump')
user1 = {
    groups: {
        user: ['southern'],
        admin: true
    }
}
ask.canUser(user1).read('jump') // true
```

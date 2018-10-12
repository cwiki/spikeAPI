const askPermissions = require('./index')

const user = {
    groups: {
        'user': ['tokyo'],
        'mayor': 1,
        'hamster': ['avenger'],
        'haru': 1
    }
}

let ask = askPermissions()
beforeAll(() => {
    ask.allow('user').to('fight')
    ask.allow('hamster').toRead('visa')
    ask.allow('mayor').to('key').notToRead('key')

    ask.allow('haru')
        .toRead('books')
        .toCreate('dogHouse')
        .toUpdate('snacks')
        .toDelete('evil')

    ask.allow('haru')
        .to('swim')
        .notToRead('swim')
        .notToCreate('swim')
        .notToUpdate('swim')
        .notToDelete('swim')
})

test('user can read fight', () => {
    expect(ask.canUser(user).read('fight')).toEqual(true)
})

test('user can not read fish', () => {
    expect(ask.canUser(user).read('fish')).toEqual(false)
})

test('hamster can read visa', () => {
    expect(ask.canUser(user).read('visa')).toEqual(true)
})

test('hamster can not create visa', () => {
    expect(ask.canUser(user).create('visa')).toEqual(false)
})

test('mayor canNotRead key, can update key', () => {
    expect(ask.canUser(user).read('key')).toEqual(false)
    expect(ask.canUser(user).update('key')).toEqual(true)
})

test('mayor can delete key', () => {
    expect(ask.canUser(user).delete('key')).toEqual(true)
})

test('to suite', () => {
    expect(ask.canUser(user).read('books')).toEqual(true)
    expect(ask.canUser(user).create('dogHouse')).toEqual(true)
    expect(ask.canUser(user).update('snacks')).toEqual(true)
    expect(ask.canUser(user).delete('evil')).toEqual(true)
})

test('notTo suite', () => {
    expect(ask.canUser(user).read('swim')).toEqual(false)
    expect(ask.canUser(user).create('swim')).toEqual(false)
    expect(ask.canUser(user).update('swim')).toEqual(false)
    expect(ask.canUser(user).delete('swim')).toEqual(false)
})

test('when context in permission context true', () => {
    expect(ask.canUser(user).when('tokyo').read('fight')).toEqual(true)
})

test('when context not in permission context false', () => {
    expect(ask.canUser(user).when('beijing').read('fight')).toEqual(false)
})
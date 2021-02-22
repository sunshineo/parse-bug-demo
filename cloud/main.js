const schema1 = new Parse.Schema('MyClass1');
schema1.addDate('field');
schema1.save();

const schema2 = new Parse.Schema('MyClass2');
schema2.addDate('field');
schema2.save();

Parse.Cloud.beforeSave('MyClass2', req => {
    console.log('here at before save for MyClass2')
})

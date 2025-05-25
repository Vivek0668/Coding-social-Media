const obj = {
    name : {
      firstName:  "Sanji",
      lastName : "Vinsmoke"
    },
    age : 21,
    role  : "Kicking cook"
}

// console.log(obj.name.lastName)
// console.log([obj.name.lastName])

const createObj = {
    [obj.name.lastName] : 'joldjrfesf'
}
console.log(createObj)
interface Person {
    firstName: string;
    lastName: string;
}

class Student implements Person {
    public fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = `${firstName} ${middleInitial} ${lastName}`;
    }
}

function greeter(person: Student) {
    return `Hello, ${person.fullName}`;
}

let user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);

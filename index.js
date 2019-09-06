let Parser = require('rss-parser')
let parser = new Parser()

f = async (feed) => {

    let content = await parser.parseURL(feed)

    let cats = []

    content.items.forEach(i => {
        console.log(`${i.title} : ${i.link}`)
        if(i.categories && i.categories.length > 0)
            i.categories.forEach(c => cats.push(c))
    });

    let distinctCats = []
    cats.forEach(c => {
        if(distinctCats.find(f => f == c) == undefined)
            distinctCats.push(c)
    })

    distinctCats.forEach(c => console.log(` [${c}] `))
}

f("https://medium.com/feed/@johnclarke_8223")
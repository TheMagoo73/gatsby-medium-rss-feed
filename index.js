let Parser = require('rss-parser')
let parser = new Parser()

f = async (feed) => {

    let content = await parser.parseURL(feed)

    console.log(JSON.stringify(content, null, 2))

    let cats = []

    content.items.map(i => {
        const {
            title,
            isoDate: date,
            creator: author,
            link,
            content
        } = i

        return {
            title,
            date,
            author,
            link,
            content
        }
    }).forEach(i =>{
        console.log(JSON.stringify(i, null, 2))
    })

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

f("https://medium.com/feed/@johnclarke_82232")
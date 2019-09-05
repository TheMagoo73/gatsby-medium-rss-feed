let Parser = require('rss-parser')
let parser = new Parser()

f = async (feed) => {

    let content = await parser.parseURL(feed)

    content.items.forEach(i => {
        console.log(`${i.title} : ${i.link}`)
    });
}

f("https://medium.com/feed/@johnclarke_82232")
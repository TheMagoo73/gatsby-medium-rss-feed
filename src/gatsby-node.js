let Parser = require('rss-parser')
let parser = new Parser()

parseFeed = async (feed) => {
   let content = await parser.parseURL(feed)    
} 

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter },
    {userName, name}) => {

    if(!userName || !name) {
        reporter.panic(`userName and name are required options.`)
    }

    const feedURL = `https://medium.com/feed/@${userName}`
    await parseFeed(feedURL)
}
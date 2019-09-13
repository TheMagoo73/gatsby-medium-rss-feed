"use strict"

let Parser = require('rss-parser')
let parser = new Parser({
    customFields: {
       item: [
          ['content:encoded', 'content']
       ],
    },
 })

let parseFeed = async (feed) => {
    let content
    
    content = await parser.parseURL(feed)

    return content.items.map(item => {
        const thumbnails = item.content.match(
            /(?<=(<img[^>]+src="))([^"\s]+)(?!"[^>]*\/z)/g
        )

        const {
            title,
            isoDate: date,
            creator: author,
            link,
            content
        } = item

        return {
            title,
            date,
            author,
            link,
            thumbnail: thumbnails ? thumbnails[0]: "",
            content
        }
    })
} 

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter },
    {userName, name}) => {

    const {createNode} = actions

    if(!userName || !name) {
        reporter.panic(`userName and name are required options.`)
    }

    const feedURL = `https://medium.com/feed/@${userName}`

    let content = []
    try{
        content = await parseFeed(feedURL)
    }
    catch(err){
        reporter.panic(`unable to parse RSS feed: ${JSON.stringify(err)}`)
    }

    content.forEach(item => {
        const id = createNodeId(item.link)
        const content = JSON.stringify(item)
        const contentDigest = createContentDigest(content)

        createNode({
            ...item,
            id,
            parent: null,
            children: [],
            internal: {
                contentDigest: contentDigest,
                type: name,
                mediaType: `application/json`,
                content: content
            }
        })
    })
}
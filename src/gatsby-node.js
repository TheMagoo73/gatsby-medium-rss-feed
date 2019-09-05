parseFeed = async (feed) => {
    
} 

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter },
    {userName, name}) => {

    if(!userName || !name) {
        reporter.panic(`userName and name are required options.`)
    }


}
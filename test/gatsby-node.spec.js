const sinon = require("sinon")
const sinonChai = require("sinon-chai")

const chai = require('chai')
chai.use(sinonChai)

chai.should()

const rewire = require('rewire')
const plugin = rewire('../src/gatsby-node')

describe("gatsby-medium-rss-feed", async () => {

    let rssStub
    let revert
    let nodeHelpers

    const userName = "foobar_12345"

    beforeEach(() => {
        rssStub = sinon.stub()
        rssStub.withArgs(`https://medium.com/feed/@${userName}`).resolves({fred: "blogs"})
        rssStub.rejects({})

        nodeHelpers = {
            actions: {
                createNode: sinon.spy(),
            },
            createNodeId: sinon.spy(),
            createContentDigest: sinon.spy(),
            reporter: {
                panic: sinon.spy()
            }
        }

        revert = plugin.__set__('parser', {parseURL: async (url) => {return rssStub(url)}})
    })

    afterEach(() => {
        revert()
    })

    it("is a Gatsby plugin", async () => {
        (typeof(plugin.sourceNodes)).should.equals('function', `Gatsby plugin must export function sourceNodes`)
    })

    it("validates required options", async () => {

        const inputs = [
            {},
            {name: "foo"},
            {userName: "bar"}
        ]

        for(let i = 0; i < inputs.length; i++)
        {
            nodeHelpers.reporter.panic.resetHistory()
            await plugin.sourceNodes(nodeHelpers, {i})
            nodeHelpers.reporter.panic.should.be.called
        }
    })

    it("parses the Medium RSS feed", async ()=> {
        await plugin.sourceNodes(nodeHelpers, {userName: userName, name: "foo"})

        rssStub.should.be.calledWith(`https://medium.com/feed/@${userName}`)
    })

    it("fails if the RSS feed fails", async () => {
        let feed = await plugin.sourceNodes(nodeHelpers, {userName: "bar", name: "foo"})

        nodeHelpers.reporter.panic.should.be.called
    })
})
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
    const userName = "foobar_12345"

    beforeEach(() => {
        rssStub = sinon.stub()
        rssStub.withArgs(`https://medium.com/feed/@${userName}`).resolves({fred: "blogs"})
        rssStub.rejects({})

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

        await inputs.forEach(async (i) => {
            const reporter = {
                panic: sinon.spy()
            }
            await plugin.sourceNodes({reporter: reporter}, {i})
            reporter.panic.should.be.called
        })

        const reporter = {
            panic: sinon.spy()
        }
        await plugin.sourceNodes({reporter: reporter}, {userName: userName, name: "foo"})
        reporter.panic.should.not.be.called
    })

    it("parses the Medium RSS feed", async ()=> {
        await plugin.sourceNodes({}, {userName: userName, name: "foo"})

        rssStub.should.be.calledWith(`https://medium.com/feed/@${userName}`)
    })

    it("fails if the RSS feed fails", async () => {
        const reporter = {
            panic: sinon.spy()
        }

        let feed = await plugin.sourceNodes({reporter}, {userName: "bar", name: "foo"})

        reporter.panic.should.be.called
    })
})
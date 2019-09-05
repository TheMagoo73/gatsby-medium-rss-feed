const sinon = require("sinon")
const sinonChai = require("sinon-chai")

const chai = require('chai')
chai.use(sinonChai)

chai.should()

const rewire = require('rewire')
const plugin = rewire('../src/gatsby-node')

describe("gatsby-medium-rss-feed", async () => {

    let rssSpy
    let revert

    beforeEach(() => {
        rssSpy = sinon.spy()
        revert = plugin.__set__('parser', {parseURL: async (url) => {rssSpy(url)}})
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
            reporter.panic.should.be.calledOnce
        })

        const reporter = {
            panic: sinon.spy()
        }
        await plugin.sourceNodes({reporter: reporter}, {userName: "bar", name: "foo"})
        reporter.panic.should.not.be.called

    })

    it("parses the Medium RSS feed", async ()=> {
        await plugin.sourceNodes({}, {userName: "foobar_12345", name: "foo"})

        rssSpy.should.be.calledOnce
        rssSpy.should.be.calledWith("https://medium.com/feed/@foobar_12345")
    })
})
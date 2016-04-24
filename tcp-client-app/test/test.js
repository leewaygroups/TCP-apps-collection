/*Require modules */
const chai = require('chai'),
    expect = chai.expect,
    net = require('net'),
    sinon = require('sinon'),
    App = require('../app/testClient'),
    inputHanler = require('../bin/cli');

var clientApp;

/*Test suite*/
describe('App', function (done) {

    before(function () {
        clientApp = new App.Client()
        clientApp.connect();
    });
   
    /*should  connect to server*/
    describe('client', function () {
        it('should be an instance of socket', function () {
            expect(clientApp.client).to.be.an.instanceof(net.Socket);
        });

        it('should connect to server', function (done) {
            expect(clientApp.isConnected).to.be.true;
            done();
        })
    });

    /*should verify and validate input*/
    describe('client', function () {
        var login, command;
        before(function () {
            login = sinon.spy(clientApp, 'logIn');
            command = sinon.spy(clientApp, 'command');
        });

        it('should NOT accept strings as command', function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, "sdfdsfsdfdsfdsfsdfs");
            expect(spy).to.be.spy;
            expect(spy.called).to.be.false;
        });

        it('should NOT accept numbers as command', function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, 1234);
            expect(spy).to.be.spy;
            expect(spy.called).to.be.false;
        });

        it('should NOT accept an array as command', function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, []);
            expect(spy).to.be.spy;
            expect(spy.called).to.be.false;
        });

        it('should NOT accept a function as command', function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, function () { });
            expect(spy).to.be.spy;
            expect(spy.called).to.be.false;
        });

        it('should accept a JSON as command to server', function () {
            var spy = sinon.spy();
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, {});
            expect(spy).to.be.spy;
            expect(spy.called).to.be.true;
        });

        it("should accept a JSON object that matches either of two worker's instructions", function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, { "request": "time" });
            expect(spy).to.be.spy;
            expect(spy.called).to.be.false;
        });
    });
    
    //should login to server
    describe('client', function () {
        it('should login to worker', function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            inputHanler(clientApp, { "name": "John" });
            expect(spy).to.be.spy;
            expect(spy.called).to.be.true;
        });
    });
    
    //should send count call to worker process
    describe('client', function () {
        it('should send count call to worker process', function () {
            var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, { "name": "John" });
            inputHanler(clientApp, { "request": "count" });
            expect(spy).to.be.spy;
            expect(spy.called).to.be.true;
        });
    });
    
    //should send time call to worker process
    describe('client', function () {
        it('should send time call to worker process', function () {
           var spy = sinon.spy();
            clientApp.on('logged-in', spy);
            clientApp.on('cmd-executing', spy);
            inputHanler(clientApp, { "name": "John" });
            inputHanler(clientApp, { "request": "time" });
            expect(spy).to.be.spy;
            expect(spy.called).to.be.true;
        });
    });
});
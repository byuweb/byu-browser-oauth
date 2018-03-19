/*
 * Copyright 2018 Brigham Young University
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as authn from './byu-browser-oauth.js';
import {FakeProvider} from './fake-authn-provider.js';

const fakeToken = {
    bearer: 'aabbccdd',
    authorizationHeader: 'Bearer aabbccdd',
    expiresAt: new Date(Date.now() + 10000),
    client: {
        id: 'fake',
        byuId: '001122334',
        appName: 'Automated Testing'
    },
    rawUserInfo: {}
};

const fakeUser = {
    personId: '000111222',
    byuId: '222111000',
    netId: 'fakestu1',
    name: {
        sortName: 'Student, Fake F',
        fullName: 'Fake Student',
        givenName: 'Fake',
        familyName: 'Student',
        familyNamePosition: 'L'
    },
    rawUserInfo: {}
};

describe('byu-browser-oauth', function () {
    let provider;
    let observers = [];
    afterEach(function () {
        for (let o of observers) {
            o.offStateChange();
        }
        observers = [];

        if (provider) {
            provider.teardown();
        }
    });
    it('starts with state \'indeterminate\'', function () {
        expect(authn.state()).to.equal('indeterminate');
    });

    describe('onStateChange', function () {
        it('notifies the callback when state changes', function (done) {
            provider = new FakeProvider({ noInitListeners: true });

            testOnStateChange(({ state, token, user }) => {
                expect(state).to.equal(authn.STATE_AUTHENTICATED, 'detail.state');
                expect(authn.state()).to.equal(authn.STATE_AUTHENTICATED, 'state()');

                expect(token).to.eql(fakeToken, 'detail.token');
                expect(authn.token()).to.eql(token, 'authn.token()');

                expect(user).to.eql(fakeUser, 'detail.user');
                expect(authn.user()).to.eql(user);
                done();
            });

            provider.setState(authn.STATE_AUTHENTICATED, fakeToken, fakeUser);
        });

        it('notifies the callback of the initial state', function (done) {
            provider = new FakeProvider();

            provider.setState(authn.STATE_AUTHENTICATING, null, null, function () {
                testOnStateChange(({ state, token, user }) => {
                    expect(state).to.equal(authn.STATE_AUTHENTICATING, 'detail.state');
                    expect(authn.state()).to.equal(authn.STATE_AUTHENTICATING, 'state()');

                    expect(token).to.be.null;
                    expect(authn.token()).to.be.null;

                    expect(user).to.be.null;
                    expect(authn.user()).to.be.null;

                    done();
                })

            });
        });
    });

    function testOnStateChange(callback) {
        const observer = authn.onStateChange(callback); 
        observers.push(observer);
        return observer;
    }
});

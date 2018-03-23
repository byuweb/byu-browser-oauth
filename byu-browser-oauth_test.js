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
import { FakeProvider } from './fake-authn-provider.js';

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
    sortName: 'Student, Fake F',
    displayName: 'Fake Student',
    givenName: 'Fake',
    familyName: 'Student',
    familyNamePosition: 'L',
    rawUserInfo: {}
};

describe('byu-browser-oauth', function () {
    describe('AuthenticationObserver', function () {
        it('passes initial state to the provided callback', function (done) {
            const prov = new FakeProvider({
                state: authn.STATE_AUTHENTICATED,
                user: fakeUser,
                token: fakeToken,
            });

            const obs = new authn.AuthenticationObserver(({ state, user, token, error }) => {
                expect(state).to.eql(authn.STATE_AUTHENTICATED);
                done();
            });

            afterEach(() => {
                obs.disconnect();
                prov.disconnect();
            });
        });

        it('can skip the initial state callback');

        it('receives updates to the initial state', function (done) {
            const prov = new FakeProvider({});
            const obs = new authn.AuthenticationObserver(({ state, user, token, error }) => {
                expect(state).to.eql(authn.STATE_AUTHENTICATED);
                done();
            }, { notifyCurrent: false });

            prov.setState(authn.STATE_AUTHENTICATED, fakeToken, fakeUser);

            afterEach(() => {
                obs.disconnect();
                prov.disconnect();
            });
        });

        it('does not fire events after being disconnected', function (done) {
            let obs;
            const prov = new FakeProvider({});

            afterEach(() => {
                prov.disconnect();
                if (obs) { obs.disconnect(); }
            });

            obs = new authn.AuthenticationObserver(({ state, user, token, error }) => {
                done('Should not have called the callback');
            }, { notifyCurrent: false });
            obs.disconnect();

            setTimeout(done, 100);
        });
    });

    describe('Helper functions', function () {
        describe('state()', function () {
            it('returns the current authentication state', async function () {
                const prov = new FakeProvider({state: authn.STATE_AUTHENTICATED, token: fakeToken, user: fakeUser});
                afterEach(() => prov.disconnect());

                expect(await authn.state()).to.equal(authn.STATE_AUTHENTICATED);
            });
        });
        describe('user()', function() {
            it('returns falsey if there is no user', async function() {
                const prov = new FakeProvider({state: authn.STATE_UNAUTHENTICATED});
                afterEach(() => prov.disconnect());

                expect(await authn.user()).to.not.exist;
            });
            it('returns the current user', async function() {
                const prov = new FakeProvider({state: authn.STATE_AUTHENTICATED, token: fakeToken, user: fakeUser});
                afterEach(() => prov.disconnect());

                expect(await authn.user()).to.eql(fakeUser);
            });
        });
        describe('token()', function() {
            it('returns falsey if there is no token', async function() {
                const prov = new FakeProvider({state: authn.STATE_UNAUTHENTICATED});
                afterEach(() => prov.disconnect());

                expect(await authn.token()).to.not.exist;
            });
            it('returns the current token', async function() {
                const prov = new FakeProvider({state: authn.STATE_AUTHENTICATED, token: fakeToken, user: fakeUser});
                afterEach(() => prov.disconnect());

                expect(await authn.token()).to.eql(fakeToken);
            });
        });
        describe('authorizationHeader()', function() {
            it('returns falsey if there is no token', async function() {
                const prov = new FakeProvider({state: authn.STATE_UNAUTHENTICATED});
                afterEach(() => prov.disconnect());

                expect(await authn.authorizationHeader()).to.not.exist;
            });
            it('returns the current authorization header', async function() {
                const prov = new FakeProvider({state: authn.STATE_AUTHENTICATED, token: fakeToken, user: fakeUser});
                afterEach(() => prov.disconnect());

                expect(await authn.authorizationHeader()).to.eql(fakeToken.authorizationHeader);
            });
        });
    });
    describe('login()', function() {
        it('exists');
    });
    describe('logout()', function() {
        it('exists');
    });
    describe('refresh()', function() {
        it('exists');
    });
});

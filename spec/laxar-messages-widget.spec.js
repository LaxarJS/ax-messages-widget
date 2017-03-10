/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as axMocks from 'laxar-mocks';
import 'angular';
import 'angular-mocks';
import specData from './spec_data';


describe( 'An ax-messages-widget', () => {

   const ANY_FUNCTION = jasmine.any( Function );
   let data;

   let widgetEventBus;
   let widgetScope;
   let widgetDom;
   let testEventBus;

   beforeEach( axMocks.setupForWidget() );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createSetup( widgetConfiguration ) {

      beforeEach( () => {
         axMocks.widget.configure( widgetConfiguration );
      } );

      beforeEach( axMocks.widget.load );

      beforeEach( () => {
         widgetDom = axMocks.widget.render();

         widgetScope = axMocks.widget.$scope;
         widgetEventBus = axMocks.widget.axEventBus;
         testEventBus = axMocks.eventBus;

         axMocks.triggerStartupEvents( {
            didChangeLocale: {
               default: {
                  locale: 'default',
                  languageTag: 'en_US'
               }
            }
         } );
         data = JSON.parse( JSON.stringify( specData ) );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   afterEach( axMocks.tearDown );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured feature messages', () => {

      createSetup( { resource: { list: [] } } );

      it( 'interprets and displays received messages as HTML content (R1.1)', () => {
         publishDidValidateEvents( [
            {
               resource: 'myResource',
               outcome: 'ERROR',
               data: [
                  {
                     htmlMessage: '<b>Wrong</b> car',
                     level: 'ERROR',
                     sortKey: '010'
                  }
               ]
            }
         ] );
         expect( widgetScope.model.messagesForView[ 0 ].htmlText ).toEqual( '<b>Wrong</b> car' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the css class of the border to the one of the error class (R1.3)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         expect( dom( '.alert-danger' ).length ).toEqual( 1 );
         expect( dom( '.alert-success' ).length ).toEqual( 1 );
         expect( dom( '.alert-warning' ).length ).toEqual( 1 );
         expect( dom( '.alert-info' ).length ).toEqual( 1 );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'assigns css classes according to message level (A1.4)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         const viewMessages = widgetScope.model.messagesForView;
         // console.log( widgetDom.outerHTML );
         expect( viewMessages.length ).toBe( 4 );
         expect( viewMessages[ 0 ].cssClass ).toEqual( 'alert alert-danger' );
         expect( viewMessages[ 1 ].cssClass ).toEqual( 'alert alert-success' );
         expect( viewMessages[ 2 ].cssClass ).toEqual( 'alert alert-warning' );
         expect( viewMessages[ 3 ].cssClass ).toEqual( 'alert alert-info' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'saves the error class, html content and sort key of each message (R1.5)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         for( let i = 0; i < widgetScope.model.messagesForView.length; ++i ) {
            expect( widgetScope.model.messages.something[ i ].level ).toBeDefined();
            expect( widgetScope.model.messages.something[ i ].sortKey ).toBeDefined();
            expect( widgetScope.model.messages.something[ i ].htmlMessage ).toBeDefined();
         }
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured feature messages and a layout variant 1', () => {
      createSetup( { layout: { variant: 2 }, resource: { list: [] } } );

      it( 'shows the appropriate list types for the variant (R1.2)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         const [ messagesElement ] = dom( '[data-ng-switch-when="flat"]' );
         expect( messagesElement.getAttribute( 'data-ng-switch-when' ) ).toEqual( 'flat' );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured feature messages and a layout variant 2', () => {
      createSetup( { layout: { variant: 1 }, resource: { list: [] } } );

      it( 'shows the appropriate list types for the variant (R1.2)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         const [ messagesElement ] = dom( '[data-ng-switch-when="list"]' );
         expect( messagesElement.getAttribute( 'data-ng-switch-when' ) ).toEqual( 'list' );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured feature messages and a layout variant 3', () => {
      createSetup( { layout: { variant: 3 }, resource: { list: [] } } );

      it( 'shows the appropriate list types for the variant (R1.2)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         const [ messagesElement ] = dom( '[data-ng-switch-when="byLevel"]' );
         expect( messagesElement.getAttribute( 'data-ng-switch-when' ) ).toEqual( 'byLevel' );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured feature messages and a layout variant 4', () => {
      createSetup( { layout: { variant: 4 }, resource: { list: [] } } );

      it( 'shows the appropriate list types for the variant (R1.2)', () => {
         publishDidValidateEvents( [ data.cssClassTestEvent ] );
         const [ messagesElement ] = dom( '[data-ng-switch-when="separate"]' );
         expect( messagesElement.getAttribute( 'data-ng-switch-when' ) ).toEqual( 'separate' );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with a configured feature messages', () => {

      describe( 'when messages were received', () => {

         createSetup( { resource: { list: [ 'pet', 'beverage', 'car' ] } } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.car );
            publishDidValidateEvents( data.simpleMessages.pet );
            publishDidValidateEvents( data.simpleMessages.beverage );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'puts these messages into a single view list (R1.6)', () => {
            expect( widgetScope.model.messagesForView.length ).toBe( 5 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts the messages by configured resources and for each resource by sortKey (R1.7)', () => {
            const viewMessages = widgetScope.model.messagesForView;

            expect( viewMessages.length ).toBe( 5 );
            expect( viewMessages[ 0 ].htmlText ).toEqual( 'No hamster' );
            expect( viewMessages[ 1 ].htmlText ).toEqual( 'Hamster is hungry' );
            expect( viewMessages[ 2 ].htmlText ).toEqual( 'Too expensive' );
            expect( viewMessages[ 3 ].htmlText ).toEqual( 'Strange color' );
            expect( viewMessages[ 4 ].htmlText ).toEqual( 'Wrong car' );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when multiple messages with same text are received', () => {

         createSetup( { resource: { list: [ 'car', 'beverage', 'car2', 'beverage2' ] } } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.car );
            publishDidValidateEvents( data.simpleMessages.car2 );
            publishDidValidateEvents( data.simpleMessages.beverage );
            publishDidValidateEvents( data.simpleMessages.beverage2 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         // eslint-disable-next-line max-len
         it( 'those messages are merged using the highest level at the first position the message occurred (R1.8, R1.9)', () => {
            const viewMessages = widgetScope.model.messagesForView;

            expect( viewMessages.length ).toBe( 3 );
            expect( viewMessages[ 0 ].htmlText ).toEqual( 'Strange color' );
            expect( viewMessages[ 0 ].level ).toEqual( 'ERROR' );
            expect( viewMessages[ 1 ].htmlText ).toEqual( 'Wrong car' );
            expect( viewMessages[ 1 ].level ).toEqual( 'ERROR' );
            expect( viewMessages[ 2 ].htmlText ).toEqual( 'Too expensive' );
            expect( viewMessages[ 2 ].level ).toEqual( 'WARNING' );
         } );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature dismiss', () => {

      describe( 'when the feature is disabled', () => {

         createSetup( {
            resource: { list: [ 'beverage' ] },
            dismiss: { enabled: false },
            layout: { variant: 2 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'there is no visible button to dismiss a message (R2.1)', () => {
            const [ hideButton ] = dom( 'button' );
            expect( hideButton.classList ).toContain( 'ng-hide' );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is enabled', () => {

         createSetup( {
            resource: { list: [ 'beverage' ] },
            dismiss: { enabled: true },
            layout: { variant: 2 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'there is a visible button to dismiss a message (R2.2)', () => {
            const [ hideButton ] = dom( 'button' );
            expect( hideButton.classList ).not.toContain( 'ng-hide' );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is enabled for variant 1 (no alert)', () => {

         createSetup( {
            resource: { list: [ 'beverage', 'car' ] },
            dismiss: { enabled: true },
            layout: { variant: 1 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );
            publishDidValidateEvents( data.simpleMessages.car );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'there is no visible dismiss button (R2.3)', () => {
            const [ hideButton ] = dom( 'button' );
            expect( hideButton ).toBeUndefined();
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is enabled for variant 2 (one alert for all messages)', () => {

         createSetup( {
            resource: { list: [ 'beverage', 'car' ] },
            dismiss: { enabled: true },
            layout: { variant: 2 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );
            publishDidValidateEvents( data.simpleMessages.car );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'all messages can be deleted together (R2.3)', () => {
            expect( widgetScope.model.messagesForView.length ).toBe( 3 );
            widgetScope.actions.hideAllMessages();
            expect( widgetScope.model.messagesForView.length ).toBe( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'there is only one visible dismiss button deleting all messages (R2.3)', () => {
            const [ hideButton ] = dom( 'button' );

            expect( widgetScope.model.messagesForView.length ).toBe( 3 );
            hideButton.click();
            expect( widgetScope.model.messagesForView.length ).toBe( 0 );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is enabled for variant 3 (one alert per error class)', () => {

         createSetup( {
            resource: { list: [ 'beverage', 'car' ] },
            dismiss: { enabled: true },
            layout: { variant: 3 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );
            publishDidValidateEvents( data.simpleMessages.car );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'each message receives a visible dismiss button (R2.3)', () => {
            expect( dom( '.alert:not(.ng-hide) button.close' ).length ).toBe( 2 );
            expect( widgetScope.model.messagesForView.length ).toBe( 3 );
            dom( '.alert-danger button.close' )[ 0 ].click();
            widgetScope.$apply();
            expect( widgetScope.model.messagesForView.length ).toBe( 2 );
            dom( '.alert-warning button.close' )[ 0 ].click();
            expect( widgetScope.model.messagesForView.length ).toBe( 0 );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is enabled for variant 4 (one alert per message)', () => {

         createSetup( {
            resource: { list: [ 'beverage', 'car' ] },
            dismiss: { enabled: true },
            layout: { variant: 4 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );
            publishDidValidateEvents( data.simpleMessages.car );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'each message receives a visible dismiss button (R2.3)', () => {
            const hideButtons = dom( 'button' );

            expect( hideButtons.length ).toBe( 3 );
            expect( widgetScope.model.messagesForView.length ).toBe( 3 );
            hideButtons[ 0 ].click();
            expect( widgetScope.model.messagesForView.length ).toBe( 2 );
            hideButtons[ 1 ].click();
            expect( widgetScope.model.messagesForView.length ).toBe( 1 );
            hideButtons[ 2 ].click();
            expect( widgetScope.model.messagesForView.length ).toBe( 0 );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is enabled and the level changes on dismiss', () => {

         createSetup( {
            resource: { list: [ 'pet' ] },
            dismiss: { enabled: true },
            layout: { variant: 3 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.pet );

            widgetScope.$apply( () => {
               widgetScope.actions.hideMessagesByLevel( 'ERROR' );
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'the internal status does not change to a lower level (R2.4)', () => {
            expect( widgetEventBus.publish )
               .not.toHaveBeenCalledWith( 'didChangeFlag.messageStatus-INFO.true', {
                  flag: 'messageStatus-INFO',
                  state: true
               } );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when there are dismissed messages and new messages arrive', () => {

         createSetup( {
            resource: { list: [ 'beverage', 'car' ] },
            dismiss: { enabled: true },
            layout: { variant: 4 }
         } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.beverage );

            widgetScope.actions.hideMessage( widgetScope.model.messagesForView[ 0 ] );
            publishDidValidateEvents( data.simpleMessages.car );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'those will be displayed (R2.5)', () => {
            const messages = dom( '[data-ng-bind-html="message.htmlText"]' ).map( _ => _.innerText );

            expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 0 ].htmlMessage.en_US );
            expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 1 ].htmlMessage.en_US );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'dismissed will remain hidden (R2.5)', () => {
            const messages = dom( '[data-ng-bind-html="message.htmlText"]' ).map( _ => _.innerText );

            expect( messages ).not.toContain( data.simpleMessages.beverage[ 0 ].data[ 0 ].htmlMessage.en_US );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when dismissed messages get renewed by didValidate events', () => {

            beforeEach( () => {
               publishDidValidateEvents( data.simpleMessages.beverage );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'they will be displayed again (R2.5)', () => {
               const messages = dom( '[data-ng-bind-html="message.htmlText"]' ).map( _ => _.innerText );

               expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 0 ].htmlMessage.en_US );
               expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 1 ].htmlMessage.en_US );
               expect( messages ).toContain( data.simpleMessages.beverage[ 0 ].data[ 0 ].htmlMessage.en_US );
            } );
         } );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature blank', () => {

      createSetup( {
         resource: { list: [] }
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'when there are no messages the widget is invisible (R3.1)', () => {
         expect( dom( '*' ) ).toEqual( [] );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature status', () => {

      createSetup( {
         resource: { list: [ 'allLevels' ] },
         status: {
            BLANK: 'status-BLANK',
            ERROR: 'myFlag0',
            WARNING: 'myFlag1',
            INFO: 'myFlag2',
            SUCCESS: 'myFlag3'
         }
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sends a state flag with BLANK when there initially is no message (R4.1, R4.3)', () => {
         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.status-BLANK.true', {
            flag: 'status-BLANK',
            state: true
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // eslint-disable-next-line max-len
      it( 'sends a state flag for the highest level (ERROR) using the configured flag name (R4.1, R4.2, R4.3)', () => {
         publishDidValidateEvents( data.allLevelEvents.slice( 0 ) );

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.myFlag0.true', {
            flag: 'myFlag0',
            state: true
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // eslint-disable-next-line max-len
      it( 'sends a state flag for the highest level (WARNING) using the configured flag name (R4.1, R4.2, R4.3)', () => {
         publishDidValidateEvents( data.allLevelEvents.slice( 1 ) );

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.myFlag1.true', {
            flag: 'myFlag1',
            state: true
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // eslint-disable-next-line max-len
      it( 'sends a state flag for the highest level (INFO) using the configured flag name (R4.1, R4.2, R4.3)', () => {
         publishDidValidateEvents( data.allLevelEvents.slice( 2 ) );

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.myFlag2.true', {
            flag: 'myFlag2',
            state: true
         } );
      } );


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // eslint-disable-next-line max-len
      it( 'sends a state flag for the highest level (SUCCESS) using the configured flag name (R4.1, R4.2, R4.3)', () => {
         publishDidValidateEvents( data.allLevelEvents.slice( 3 ) );

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.myFlag3.true', {
            flag: 'myFlag3',
            state: true
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sends a flag with state false for the previous state (R4.4)', () => {

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.status-BLANK.true', {
            flag: 'status-BLANK',
            state: true
         } );

         publishDidValidateEvents( data.allLevelEvents.slice( 0, 1 ) );
         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.status-BLANK.false', {
            flag: 'status-BLANK',
            state: false
         } );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature status', () => {

      createSetup( {
         status: {
            reset: {
               onActions: [ 'resetMessages' ]
            },
            BLANK: 'status-BLANK',
            ERROR: 'status-ERROR'
         },
         resource: {
            list: [ 'allLevels' ]
         }
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets state to BLANK and deletes all messages if a configured action is triggered (R4.5)', () => {
         publishDidValidateEvents( data.allLevelEvents.slice( 0 ) );

         expect( widgetScope.model.messagesForView.length ).toBe( 4 );

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.status-ERROR.true', {
            flag: 'status-ERROR',
            state: true
         } );

         testEventBus.publish( 'takeActionRequest.resetMessages', {
            action: 'resetMessages'
         } );
         testEventBus.flush();

         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'willTakeAction.resetMessages', {
            action: 'resetMessages'
         } );
         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didChangeFlag.status-BLANK.true', {
            flag: 'status-BLANK',
            state: true
         } );
         expect( widgetEventBus.publish ).toHaveBeenCalledWith( 'didTakeAction.resetMessages', {
            action: 'resetMessages'
         } );
         expect( widgetScope.model.messagesForView.length ).toBe( 0 );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature resource', () => {

      describe( 'if resource list is null', () => {

         createSetup( { resource: { list: null } } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'the feature is completely disabled (R5.1)', () => {
            const unexpectedCalls = widgetEventBus.subscribe.calls.allArgs()
               .reduce( ( collectedCalls, call ) => {
                  return call[ 0 ].match( /^didValidate|^didReplace|^validateRequest/ ) ?
                     [ ...collectedCalls, call.args[ 0 ] ] :
                     collectedCalls;
               }, [] );

            expect( unexpectedCalls ).toEqual( [] );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'if resource list is empty', () => {

         createSetup( { resource: { list: [] } } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'all resources are validated (R5.2)', () => {
            expect( widgetEventBus.subscribe ).toHaveBeenCalledWith( 'didValidate', ANY_FUNCTION );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'if resource list is empty', () => {

         describe( 'when messages are received', () => {

            createSetup( { resource: { list: [] } } );

            beforeEach( () => {
               publishDidValidateEvents( data.simpleMessages.car );
               publishDidValidateEvents( data.simpleMessages.pet );
               publishDidValidateEvents( data.simpleMessages.beverage );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'all messages are inserted into the respective lists (R5.3, R5.6)', () => {
               expect( widgetScope.model.messages.car )
                  .toEqual( data.simpleMessages.car[ 0 ].data );
               expect( widgetScope.model.messages.pet )
                  .toEqual( [
                     data.simpleMessages.pet[ 0 ].data[ 0 ],
                     data.simpleMessages.pet[ 1 ].data[ 0 ]
                  ] );
               expect( widgetScope.model.messages.beverage )
                  .toEqual( data.simpleMessages.beverage[ 0 ].data );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'messages are deleted again for didReplace of a certain resource (R5.4)', () => {
               testEventBus.publish( 'didReplace.pet', { resource: 'pet', data: {} } );
               testEventBus.publish( 'didReplace.beverage', { resource: 'beverage', data: {} } );
               testEventBus.flush();

               expect( widgetScope.model.messages.car ).toEqual( data.simpleMessages.car[ 0 ].data );
               expect( widgetScope.model.messages.pet ).toEqual( [] );
               expect( widgetScope.model.messages.beverage ).toEqual( [] );

               expect( widgetScope.model.messagesForView.length ).toBe( 2 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'messages are deleted again for validateRequest of a certain resource (R5.4)', () => {
               testEventBus.publish( 'validateRequest.pet', { resource: 'pet' } );
               testEventBus.publish( 'validateRequest.beverage', { resource: 'beverage' } );
               testEventBus.flush();

               expect( widgetScope.model.messages.car ).toEqual( data.simpleMessages.car[ 0 ].data );
               expect( widgetScope.model.messages.pet ).toEqual( [] );
               expect( widgetScope.model.messages.beverage ).toEqual( [] );

               expect( widgetScope.model.messagesForView.length ).toBe( 2 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            // eslint-disable-next-line max-len
            it( 'messages for sub-topics are deleted on validateRequest of a super-topic resource (R5.5)', () => {
               publishDidValidateEvents( data.subMessages[ 'pet-health' ] );
               testEventBus.flush();
               expect( widgetScope.model.messages[ 'pet-health' ] )
                  .toEqual( data.subMessages[ 'pet-health' ][ 0 ].data );
               expect( widgetScope.model.messagesForView.length ).toBe( 6 );

               testEventBus.publish( 'validateRequest.pet', { resource: 'pet' } );
               testEventBus.flush();
               expect( widgetScope.model.messages[ 'pet-health' ] ).toEqual( [] );
               expect( widgetScope.model.messagesForView.length ).toBe( 3 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            // eslint-disable-next-line max-len
            it( 'messages are not deleted again for SUCCESS message of a certain resource (replace is false) (R5.9)', () => {
               publishDidValidateEvents( data.simpleMessages.car3 );

               const carMessages = [
                  ...data.simpleMessages.car[ 0 ].data,
                  ...data.simpleMessages.car3[ 0 ].data
               ];

               expect( widgetScope.model.messages.car ).toEqual( carMessages );
               expect( widgetScope.model.messagesForView.length ).toBe( 6 );
            } );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and an exclude list is given', () => {

            createSetup( { resource: { list: [], exclude: [ 'car', 'pet' ] } } );

            beforeEach( () => {
               publishDidValidateEvents( data.simpleMessages.car );
               publishDidValidateEvents( data.simpleMessages.pet );
               publishDidValidateEvents( data.simpleMessages.beverage );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'messages of excluded resources are not inserted into the respective lists (R5.7)', () => {
               expect( widgetScope.model.messages.car ).toBeUndefined();
               expect( widgetScope.model.messages.pet ).toBeUndefined();
               expect( widgetScope.model.messages.beverage )
                  .toEqual( data.simpleMessages.beverage[ 0 ].data );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            // eslint-disable-next-line max-len
            it( 'messages of resources that are subtopics of excluded resources are not inserted into the respective lists (R5.8)', () => {
               expect( widgetScope.model.messages.car ).toBeUndefined();
               expect( widgetScope.model.messages.pet ).toBeUndefined();
               expect( widgetScope.model.messages.beverage )
                  .toEqual( data.simpleMessages.beverage[ 0 ].data );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and SUCCESS message should replace others (R5.9)', () => {

            createSetup( { resource: { list: [], replace: true } } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            describe( 'when messages are received', () => {

               beforeEach( () => {
                  publishDidValidateEvents( data.simpleMessages.car );
                  publishDidValidateEvents( data.simpleMessages.pet );
                  publishDidValidateEvents( data.simpleMessages.beverage );
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               it( 'messages are deleted again for SUCCESS message of a certain resource (R5.9)', () => {

                  publishDidValidateEvents( data.simpleMessages.car3 );

                  expect( widgetScope.model.messages.car )
                     .toEqual( data.simpleMessages.car3[ 0 ].data );

                  expect( widgetScope.model.messagesForView.length ).toBe( 4 );

               } );
            } );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'if resource list is given', () => {

         createSetup( { resource: { list: [ 'car', 'pet' ] } } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'only the relevant resources are validated (R5.2)', () => {
            expect( widgetEventBus.subscribe ).not.toHaveBeenCalledWith( 'didValidate', ANY_FUNCTION );
            expect( widgetEventBus.subscribe ).not.toHaveBeenCalledWith( 'didReplace', ANY_FUNCTION );

            expect( widgetEventBus.subscribe ).toHaveBeenCalledWith( 'didValidate.car', ANY_FUNCTION );
            expect( widgetEventBus.subscribe ).toHaveBeenCalledWith( 'didValidate.pet', ANY_FUNCTION );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when messages are received', () => {

            beforeEach( () => {
               publishDidValidateEvents( data.simpleMessages.car );
               publishDidValidateEvents( data.simpleMessages.pet );
               publishDidValidateEvents( data.simpleMessages.beverage );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'relevant messages are inserted into the respective lists (R5.3, R5.6)', () => {
               expect( widgetScope.model.messages.car ).toEqual( data.simpleMessages.car[ 0 ].data );
               expect( widgetScope.model.messages.pet ).toEqual( [
                  data.simpleMessages.pet[ 0 ].data[ 0 ],
                  data.simpleMessages.pet[ 1 ].data[ 0 ]
               ] );
               expect( widgetScope.model.messages.beverage ).toBeUndefined();
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'messages are deleted again for didReplace of a certain resource (R5.4)', () => {
               testEventBus.publish( 'didReplace.pet', { resource: 'pet', data: {} } );
               testEventBus.flush();

               expect( widgetScope.model.messages.car ).toEqual( data.simpleMessages.car[ 0 ].data );
               expect( widgetScope.model.messages.pet ).toEqual( [] );
               expect( widgetScope.model.messages.beverage ).toBeUndefined();

               expect( widgetScope.model.messagesForView.length ).toBe( 2 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'messages are deleted again for validateRequest of a certain resource (R5.4)', () => {
               testEventBus.publish( 'validateRequest.pet', { resource: 'pet' } );
               testEventBus.flush();

               expect( widgetScope.model.messages.car ).toEqual( data.simpleMessages.car[ 0 ].data );
               expect( widgetScope.model.messages.pet ).toEqual( [] );

               expect( widgetScope.model.messagesForView.length ).toBe( 2 );
            } );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'if a resource list and an exclude list is given', () => {

         createSetup( { resource: { list: [ 'car', 'pet' ], exclude: [ 'pet' ] } } );

         beforeEach( () => {
            publishDidValidateEvents( data.simpleMessages.car );
            publishDidValidateEvents( data.simpleMessages.pet );
            publishDidValidateEvents( data.simpleMessages.beverage );
            publishDidValidateEvents( data.subMessages[ 'pet-health' ] );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'messages of excluded resources are not inserted into the respective lists (R5.7)', () => {
            expect( widgetScope.model.messages.car )
               .toEqual( data.simpleMessages.car[ 0 ].data );
            expect( widgetScope.model.messages.pet ).toBeUndefined();
            expect( widgetScope.model.messages.beverage ).toBeUndefined();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sub-resources of excluded resources are not inserted into the respective lists (R5.8)', () => {
            expect( widgetScope.model.messages[ 'pet-health' ] ).toBeUndefined();
         } );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature errors', () => {

      describe( 'when the feature is enabled', () => {

         createSetup( { errors: { enabled: true } } );

         beforeEach( () => {
            testEventBus.publish( 'didEncounterError.HTTP_PUT', {
               code: 'HTTP_PUT',
               message: 'There was an error'
            } );
            testEventBus.flush();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'the widget subscribes to this type of events (R6.2)', () => {
            expect( widgetEventBus.subscribe ).toHaveBeenCalledWith( 'didEncounterError', ANY_FUNCTION );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         // eslint-disable-next-line max-len
         it( 'the treats the events as validation messages of outcome ERROR of a special resource (R6.1, R6.3)', () => {
            expect( widgetScope.model.messages._DID_ENCOUNTER_ERROR_RESOURCE ).toEqual( [ {
               level: 'ERROR',
               htmlMessage: 'There was an error',
               sortKey: '000'
            } ] );
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when the feature is disabled', () => {

         createSetup( { errors: { enabled: false } } );

         beforeEach( () => {
            testEventBus.publish( 'didEncounterError' );
            testEventBus.flush();
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'the widget ignores this type of events (R6.2)', () => {
            expect( widgetEventBus.subscribe ).not.toHaveBeenCalledWith( 'didEncounterError', ANY_FUNCTION );
         } );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with feature i18n', () => {

      createSetup( {
         resource: { list: [ 'beverage', 'car' ] },
         dismiss: { enabled: true },
         layout: { variant: 4 }
      } );

      beforeEach( () => {
         publishDidValidateEvents( data.simpleMessages.car );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'updates the message as the locale changes (R7.1)', () => {
         let messages = dom( '[data-ng-bind-html="message.htmlText"]' ).map( _ => _.innerText );
         expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 0 ].htmlMessage.en_US );
         expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 1 ].htmlMessage.en_US );

         testEventBus.publish( 'didChangeLocale.default', {
            locale: 'default',
            languageTag: 'de_DE'
         } );
         testEventBus.flush();
         widgetScope.$root.$digest();

         messages = dom( '[data-ng-bind-html="message.htmlText"]' ).map( _ => _.innerText );
         expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 0 ].htmlMessage.de_DE );
         expect( messages ).toContain( data.simpleMessages.car[ 0 ].data[ 1 ].htmlMessage.de_DE );
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function publishDidValidateEvents( events ) {
      events.forEach( event => {
         testEventBus.publish( `didValidate.${event.resource}`, event );
         testEventBus.flush();
      } );
      widgetScope.$root.$digest();
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function dom( selector ) {
      return Array.from( widgetDom.querySelectorAll( selector ) );
   }

} );

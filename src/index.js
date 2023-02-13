/**
 * External Dependencies
 */
 import classnames from 'classnames';

 /**
  * WordPress Dependencies
  */
 const { __ } = wp.i18n;
 const { addFilter } = wp.hooks;
 const { Fragment }	= wp.element;
 const { InspectorControls }	= wp.blockEditor;
 const { createHigherOrderComponent } = wp.compose;
 import { Panel, PanelBody, PanelRow, SelectControl } from '@wordpress/components';

 const { fonts: hbfpfonts, apply_to_blocks } = hu_bfp_settings;
 
 
 /**
  * Add custom attribute for mobile visibility.
  *
  * @param {Object} settings Settings for the block.
  *
  * @return {Object} settings Modified settings.
  */
 function addAttributes( settings ) {
     
    //check if object exists for old Gutenberg version compatibility
    //add allowedBlocks restriction
    if( apply_to_blocks.includes( settings.name ) ){
     
        const { attributes } = settings;
        return {
            ...settings,
            attributes: {
                ...attributes,
                hbfpCustomFont: {
                    type: 'string',
                    default: ''
                }
            }
        }      
    }
    return settings;
 }
 
 /**
  * Add mobile visibility controls on Advanced Block Panel.
  *
  * @param {function} BlockEdit Block edit component.
  *
  * @return {function} BlockEdit Modified block edit component.
  */
 const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
     return ( props ) => {
        const {
            name,
            attributes,
            setAttributes,
            isSelected,
        } = props;
 
        const {
            hbfpCustomFont
        } = attributes;

        if( ! apply_to_blocks.includes( name )){
            return (
                <Fragment>
                    <BlockEdit {...props} />
                </Fragment>
            )
        }

        const classes = ( !! hbfpCustomFont ) ? 'has-custom-font-' + hbfpCustomFont : ''; 

        const className = classnames( props?.className, classes );
        props.className = className;
        return (
            <Fragment>
                <BlockEdit {...props}/>
                { isSelected &&
                    <InspectorControls>
                        <Panel>
                            <PanelBody title={ __( 'Custom Font' ) } initialOpen={ true }>
                                <PanelRow>
                                    <SelectControl
                                        label={ __( 'Custom Font' ) }
                                        value={ hbfpCustomFont }
                                        options={ hbfpfonts }
                                        onChange={ ( newFont ) => setAttributes( { hbfpCustomFont: newFont } ) }
                                    />
                                </PanelRow>
                            </PanelBody>
                        </Panel>
                    </InspectorControls>
                }

            </Fragment>
         );
     };
 }, 'withInspectorControls');

 
 /**
  * Add custom element class in save element.
  *
  * @param {Object} extraProps     Block element.
  * @param {Object} blockType      Blocks object.
  * @param {Object} attributes     Blocks attributes.
  *
  * @return {Object} extraProps Modified block element.
  */
 function applyExtraClass( extraProps, blockType, attributes ) {
 
     const { 
        hbfpCustomFont
      } = attributes;
     

    /*if( ! apply_to_blocks.includes( blockType.name ) ){
        return extraProps;
    }*/

    const classes = ( !! hbfpCustomFont ) ? 'has-custom-font-' + hbfpCustomFont : '';

    return lodash.assign( 
        extraProps, 
        { 
            className: classnames( extraProps.className, classes )
        } 
    );

 }

const showInEditor = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {
       const {
           name,
           block,
           attributes,
           setAttributes,
           isSelected,
           className
       } = props;

       const {
           hbfpCustomFont
       } = attributes;
       
       let wrapperProps = props.wrapperProps ? props.wrapperProps : {};
       if( ! apply_to_blocks.includes( name )){
           return <BlockListBlock {...props} />
       }

       const classes = ( !! hbfpCustomFont ) ? 'has-custom-font-' + hbfpCustomFont : ''; 

       const newClassName = classnames( className, classes );
       wrapperProps.className = newClassName;
       return <BlockListBlock {...props}  className={ newClassName } wrapperProps={ wrapperProps } />
    };
});
 
 //add filters
 
 addFilter(
     'blocks.registerBlockType',
     'huishu/block-font-picker',
     addAttributes
 );
 
 addFilter(
     'blocks.getSaveContent.extraProps',
     'huishu/block-font-picker',
     applyExtraClass
 );


 addFilter(
    'editor.BlockEdit',
    'huishu/block-font-picker',
    withInspectorControls
);

wp.hooks.addFilter(
    'editor.BlockListBlock',
    'huishu/block-font-picker',
    showInEditor
);
import React, { Component } from 'react';
import dynamic from 'next/dynamic';

const AceEditor = dynamic(
      async () => {
        const ace = await import('react-ace');    
        require('ace-builds/src-noconflict/mode-mysql');
        require('ace-builds/src-noconflict/mode-c_cpp');
        require('ace-builds/src-noconflict/mode-java');
        require('ace-builds/src-noconflict/mode-python');
        require('ace-builds/src-noconflict/mode-javascript');
        require('ace-builds/src-noconflict/mode-php');
        require('ace-builds/src-noconflict/mode-css');
        require('ace-builds/src-noconflict/mode-html');

        require('ace-builds/src-noconflict/theme-xcode');
        require('ace-builds/src-noconflict/theme-monokai');
        require('ace-builds/src-noconflict/theme-github');
        require('ace-builds/src-noconflict/ext-language_tools');
        return ace;
      },      
     {
      loading: () => (
        <>Loading...</>
      ),
      ssr: false,
    })
  
module.exports = AceEditor



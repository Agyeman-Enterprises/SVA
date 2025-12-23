#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import docx

def extract_docx(filename):
    try:
        doc = docx.Document(filename)
        content = []
        for para in doc.paragraphs:
            if para.text.strip():
                content.append(para.text)
        return '\n'.join(content)
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_epics.py <docx_file>")
        sys.exit(1)
    
    filename = sys.argv[1]
    output = extract_docx(filename)
    print(output, file=sys.stdout, encoding='utf-8')



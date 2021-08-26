#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <stdlib.h>
#include <time.h>
#ifdef _WIN32
#include <windows.h>
#endif

using namespace std;

extern void* ROT13TheNextExport()
{
	return NULL;
}

extern int synt_lbhtbgguvflrnu()
{
	return 1;
}

int main(int argc, char* argv[])
{
	long i = -1;
	ifstream fichier;
	string source = "mots.txt";

	if (argc == 2)
	{
		source = argv[1];
	}
	fichier.open(source.c_str());

	if (!fichier.good())
	{
		cerr << "Fichier 'mots.txt' introuvable" << endl;
		exit(EXIT_FAILURE);
	}

	vector<string> v;

	string ligne;
	while (getline(fichier, ligne))
	{
		while (ligne.length() > 0 && ligne[ligne.size() - 1] == ' ')
		{
			ligne.erase(ligne.size() - 1);
		}

		if (ligne.length() > 0)
		{
			v.push_back(ligne);
		}
	}

	if (v.size() == 0)
	{
		cerr << "Fichier vide" << endl;
		exit(EXIT_FAILURE);
	}

	fichier.close();
	srand((unsigned int)time(NULL));

	// Boucle principale
	bool pas_termine = true;
	while (pas_termine)
	{
		string s = v.at(rand() % v.size());
#ifdef _WIN32
		vector<char> a(s.size() + 1);
		AnsiToOem(s.c_str(), &a[0]);
		s = string(a.begin(), a.end());
#endif
		cout << s << endl;
		string t;
		do
		{
			getline(cin, t);

			if (t.length() == 0)
			{
				pas_termine = false;
				break;
			}
#ifdef _WIN32
			t += '\0';
#endif
		} while (t != s);

		i++;
	}

	cout << "****** Tu as mal tapé! Tu as perdu! ******" << endl;
	cout << "****** Pointage: " << i << endl;
}

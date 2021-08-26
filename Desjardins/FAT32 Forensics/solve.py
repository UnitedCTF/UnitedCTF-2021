import os
from datetime import datetime

# Pour chaque fichier dans le dossier "flags"
for i, file in enumerate(os.listdir('C:/Users/Administrator/Desktop/flags')):
    # Récupérer les métadonnées du fichier
    stats = os.stat(f"C:/Users/Administrator/Desktop/flags/{file}")

    # On print le nom du fichier et la date de sa dernière modification.
    print(file)
    print(f"Modification: {datetime.fromtimestamp(stats.st_mtime)}")
    print()
